#!/usr/bin/env node
import { promises as fs } from "node:fs"
import path from "node:path"
import { parseDescription, parseFrontmatter, stripQuotes } from "./lib/skills/frontmatter.mjs"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"

const ROOT = process.cwd()
const SKILLS_SRC_DIR = path.join(ROOT, "src", "skills")
const REPORTS_DIR = path.join(ROOT, "dist", "reports")
const JSON_REPORT = path.join(REPORTS_DIR, "skills-compat-report.json")
const MD_REPORT = path.join(REPORTS_DIR, "skills-compat-report.md")

const hasLegacyInlineRules = (content) =>
  content.includes("## Dynamic Rules Ecosystem") || content.includes("### Core / Global Rules")

const classifySkill = ({
  hasSkillMd,
  hasFrontmatter,
  hasName,
  hasDescription,
  hasOpenAiYaml,
  hasLegacy,
}) => {
  if (!hasSkillMd || !hasFrontmatter || !hasName || !hasDescription) return "blocked"
  if (hasOpenAiYaml && !hasLegacy) return "auto-migrable"
  return "manual-migration"
}

const renderMarkdown = (report) => {
  const lines = []
  lines.push("# Skills Compatibility Report")
  lines.push("")
  lines.push(`Generated at: ${report.generatedAt}`)
  lines.push("")
  lines.push("## Summary")
  lines.push("")
  lines.push(`- Total skills: ${report.summary.totalSkills}`)
  lines.push(`- auto-migrable: ${report.summary.classificationCounts["auto-migrable"]}`)
  lines.push(`- manual-migration: ${report.summary.classificationCounts["manual-migration"]}`)
  lines.push(`- blocked: ${report.summary.classificationCounts.blocked}`)
  lines.push("")
  lines.push("## Exceptions")
  lines.push("")
  if (report.exceptions.length === 0) {
    lines.push("- None")
  } else {
    for (const item of report.exceptions) {
      lines.push(`- ${item.skill}: ${item.reason}`)
    }
  }
  lines.push("")
  lines.push("## Migration Order")
  lines.push("")
  for (const item of report.migrationOrder) {
    lines.push(`- ${item}`)
  }
  lines.push("")
  lines.push("## Skills")
  lines.push("")
  for (const skill of report.skills) {
    lines.push(`### ${skill.name}`)
    lines.push("")
    lines.push(`- path: ${skill.relativePath}`)
    lines.push(`- classification: ${skill.classification}`)
    lines.push(`- frontmatterFields: ${skill.frontmatterFields.join(", ") || "none"}`)
    lines.push(`- hasOpenAiYaml: ${skill.hasOpenAiYaml}`)
    lines.push(`- hasLegacyInlineRules: ${skill.hasLegacyInlineRules}`)
    lines.push("")
  }

  return `${lines.join("\n")}\n`
}

const main = async () => {
  const skillDirs = await listSkillDirs(SKILLS_SRC_DIR)
  const skills = []

  for (const skillDir of skillDirs) {
    const skillMdPath = path.join(skillDir, "SKILL.md")
    const openAiYamlPath = path.join(skillDir, "agents", "openai.yaml")

    let content = ""
    let hasSkillMd = false
    let hasFrontmatter = false
    let hasName = false
    let hasDescription = false
    let frontmatterFields = []
    let skillName = path.basename(skillDir)

    try {
      content = await fs.readFile(skillMdPath, "utf8")
      hasSkillMd = true

      const frontmatter = parseFrontmatter(content)
      hasFrontmatter = frontmatter !== null
      if (frontmatter) {
        frontmatterFields = Array.from(frontmatter.fields.keys())
        hasName = Boolean(stripQuotes(frontmatter.fields.get("name") || ""))
        hasDescription = Boolean(parseDescription(frontmatter.raw))
        skillName = stripQuotes(frontmatter.fields.get("name") || skillName)
      }
    } catch {
      // no-op: classification handles missing SKILL.md
    }

    let hasOpenAiYaml = false
    try {
      await fs.access(openAiYamlPath)
      hasOpenAiYaml = true
    } catch {
      // openai.yaml is optional at inventory stage; absence is reported in output
    }

    const hasLegacy = hasLegacyInlineRules(content)
    const classification = classifySkill({
      hasSkillMd,
      hasFrontmatter,
      hasName,
      hasDescription,
      hasOpenAiYaml,
      hasLegacy,
    })

    skills.push({
      name: skillName,
      relativePath: path.relative(ROOT, skillDir).replace(/\\/g, "/"),
      classification,
      frontmatterFields,
      hasOpenAiYaml,
      hasLegacyInlineRules: hasLegacy,
      checks: {
        hasSkillMd,
        hasFrontmatter,
        hasName,
        hasDescription,
      },
    })
  }

  skills.sort((a, b) => a.name.localeCompare(b.name))

  const classificationCounts = {
    "auto-migrable": skills.filter((s) => s.classification === "auto-migrable").length,
    "manual-migration": skills.filter((s) => s.classification === "manual-migration").length,
    blocked: skills.filter((s) => s.classification === "blocked").length,
  }

  const exceptions = []
  for (const skill of skills) {
    if (!skill.hasOpenAiYaml) {
      exceptions.push({ skill: skill.name, reason: "Missing agents/openai.yaml" })
    }
    if (skill.hasLegacyInlineRules) {
      exceptions.push({ skill: skill.name, reason: "Legacy inline rules detected" })
    }
    const unexpectedFields = skill.frontmatterFields.filter(
      (field) => field !== "name" && field !== "description",
    )
    if (unexpectedFields.length > 0) {
      exceptions.push({
        skill: skill.name,
        reason: `Unexpected frontmatter fields: ${unexpectedFields.join(", ")}`,
      })
    }
  }

  const migrationOrder = [
    ...skills.filter((s) => s.classification === "blocked").map((s) => `${s.name} (blocked)`),
    ...skills
      .filter((s) => s.classification === "manual-migration")
      .map((s) => `${s.name} (manual-migration)`),
    ...skills
      .filter((s) => s.classification === "auto-migrable")
      .map((s) => `${s.name} (auto-migrable)`),
  ]

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalSkills: skills.length,
      classificationCounts,
    },
    exceptions,
    migrationOrder,
    skills,
  }

  await fs.mkdir(REPORTS_DIR, { recursive: true })
  await fs.writeFile(JSON_REPORT, JSON.stringify(report, null, 2) + "\n", "utf8")
  await fs.writeFile(MD_REPORT, renderMarkdown(report), "utf8")

  console.log(`Wrote ${JSON_REPORT}`)
  console.log(`Wrote ${MD_REPORT}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
