import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"
import { parseDescription, parseFrontmatter, stripQuotes } from "./lib/skills/frontmatter.mjs"
import { loadSkillRulesManifest, validateSkillRulesManifestShape } from "./lib/skills/manifest.mjs"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"

const ROOT = process.cwd()
const RULES_DIR = path.join(ROOT, "src", "rules")
const SKILLS_SRC_DIR = path.join(ROOT, "src", "skills")
const SKILLS_DIST_DIR = path.join(ROOT, "dist", "skills")
const MANIFEST_PATH = path.join(SKILLS_SRC_DIR, "skill-rules.map.json")

const RULES_INDEX_START = "<!-- GENERATED-RULES-INDEX:START -->"
const RULES_INDEX_END = "<!-- GENERATED-RULES-INDEX:END -->"
const RULES_INDEX_HEADING = "## Rules Index"

const copyDirRecursive = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, destPath)
      continue
    }

    await fs.copyFile(srcPath, destPath)
  }
}

const renderRulesIndex = (rules) => {
  const lines = [
    RULES_INDEX_HEADING,
    RULES_INDEX_START,
    ...rules.map((rule) => `- ${rule}`),
    RULES_INDEX_END,
  ]

  return `${lines.join("\n")}\n`
}

const upsertRulesIndex = (content, rules) => {
  const rendered = renderRulesIndex(rules)
  const startIdx = content.indexOf(RULES_INDEX_START)
  const endIdx = content.indexOf(RULES_INDEX_END)

  if (startIdx !== -1 || endIdx !== -1) {
    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
      throw new Error("Malformed generated rules index markers in SKILL.md")
    }

    const headingIdx = content.lastIndexOf(RULES_INDEX_HEADING, startIdx)
    if (headingIdx === -1) {
      throw new Error("Rules index markers found without heading in SKILL.md")
    }

    const afterEnd = endIdx + RULES_INDEX_END.length
    const before = content.slice(0, headingIdx).trimEnd()
    const after = content.slice(afterEnd).trimStart()
    return `${before}\n\n${rendered}${after.length > 0 ? `\n${after}` : ""}`
  }

  const base = content.trimEnd()
  return `${base}\n\n${rendered}`
}

const parseSkillNameFromContent = (content, filePath) => {
  const frontmatter = parseFrontmatter(content)
  if (!frontmatter) {
    throw new Error(`Missing frontmatter in ${filePath}`)
  }

  const rawName = frontmatter.fields.get("name")
  const name = stripQuotes(rawName || "")
  if (!name) {
    throw new Error(`Missing frontmatter 'name' in ${filePath}`)
  }

  const description = parseDescription(frontmatter.raw)
  if (!description) {
    throw new Error(`Missing frontmatter 'description' in ${filePath}`)
  }

  return name
}

const buildRuleRefSet = async () => {
  const files = await listFilesRecursive(RULES_DIR)
  const set = new Set()

  for (const abs of files) {
    if (!abs.endsWith(".mdc")) continue
    const rel = path.relative(RULES_DIR, abs).replace(/\\/g, "/")
    set.add(`@rules/${rel}`)
  }

  return set
}

const validateManifestReferences = (manifest, validRuleRefs, skillNames) => {
  const errors = []
  const manifestSkillNames = new Set(Object.keys(manifest.skills))

  for (const skillName of skillNames) {
    if (!manifestSkillNames.has(skillName)) {
      errors.push(`Skill '${skillName}' is missing in ${MANIFEST_PATH}`)
    }
  }

  for (const manifestSkillName of manifestSkillNames) {
    if (!skillNames.has(manifestSkillName)) {
      errors.push(`Manifest entry '${manifestSkillName}' has no matching skill directory`)
    }

    const rules = manifest.skills[manifestSkillName]?.rules || []
    for (const rule of rules) {
      if (!validRuleRefs.has(rule)) {
        errors.push(`Manifest entry '${manifestSkillName}' references missing rule: ${rule}`)
      }
    }
  }

  return errors
}

const main = async () => {
  console.log("Compiling skills...")

  const manifest = await loadSkillRulesManifest(MANIFEST_PATH)
  const shapeValidation = validateSkillRulesManifestShape(manifest)
  if (shapeValidation.errors.length > 0) {
    throw new Error(`Invalid skill rules manifest:\n- ${shapeValidation.errors.join("\n- ")}`)
  }

  const skillDirs = await listSkillDirs(SKILLS_SRC_DIR)
  if (skillDirs.length === 0) {
    throw new Error("No skills found in src/skills")
  }

  const skillNameToSourceDir = new Map()
  for (const skillDir of skillDirs) {
    const skillMdPath = path.join(skillDir, "SKILL.md")
    const content = await fs.readFile(skillMdPath, "utf8")

    if (content.includes("## Dynamic Rules Ecosystem")) {
      throw new Error(`Legacy inline rules detected in source skill: ${skillMdPath}`)
    }

    const skillName = parseSkillNameFromContent(content, skillMdPath)
    skillNameToSourceDir.set(skillName, skillDir)
  }

  const validRuleRefs = await buildRuleRefSet()
  const manifestErrors = validateManifestReferences(
    manifest,
    validRuleRefs,
    new Set(skillNameToSourceDir.keys()),
  )
  if (manifestErrors.length > 0) {
    throw new Error(`Skill manifest validation failed:\n- ${manifestErrors.join("\n- ")}`)
  }

  await fs.rm(SKILLS_DIST_DIR, { recursive: true, force: true })

  const sortedSkillNames = Array.from(skillNameToSourceDir.keys()).sort((a, b) =>
    a.localeCompare(b),
  )
  for (const skillName of sortedSkillNames) {
    const sourceDir = skillNameToSourceDir.get(skillName)
    const relative = path.relative(SKILLS_SRC_DIR, sourceDir)
    const distDir = path.join(SKILLS_DIST_DIR, relative)

    await copyDirRecursive(sourceDir, distDir)

    const distSkillMdPath = path.join(distDir, "SKILL.md")
    const distContent = await fs.readFile(distSkillMdPath, "utf8")
    const withRulesIndex = upsertRulesIndex(distContent, manifest.skills[skillName].rules)

    if (withRulesIndex.includes("## Dynamic Rules Ecosystem")) {
      throw new Error(`Legacy rules block leaked into output: ${distSkillMdPath}`)
    }

    await fs.writeFile(distSkillMdPath, withRulesIndex, "utf8")
  }

  console.log(`Successfully compiled skills to ${SKILLS_DIST_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
