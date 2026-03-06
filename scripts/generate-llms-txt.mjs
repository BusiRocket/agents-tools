#!/usr/bin/env node
/**
 * Generates llms.txt at repo root for skill discovery.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"
import { parseDescription, parseFrontmatter, stripQuotes } from "./lib/skills/frontmatter.mjs"

const ROOT = process.cwd()
const SKILLS_DIR = join(ROOT, "src", "skills")
const LLMS_TXT = join(ROOT, "llms.txt")

function buildLlmsTxt(skills) {
  const lines = [
    "# BusiRocket Agent Skills",
    "",
    "A collection of reusable Agent Skills for TypeScript/React/Next.js/Rust/Tauri projects. Skills follow the Agent Skills format (https://agentskills.io/specification).",
    "",
    "## Skills",
    "",
  ]
  for (const { name, description, skillPath } of skills) {
    const relativePath = relative(ROOT, skillPath).replace(/\\/g, "/")
    lines.push(`- ${name}: ${description}`)
    lines.push(`  ${relativePath}/SKILL.md`)
    lines.push("")
  }
  lines.push("## Links")
  lines.push("")
  lines.push("- [Agent Skills specification](https://agentskills.io/specification)")
  lines.push("- [Integrate skills into your agent](https://agentskills.io/integrate-skills)")
  lines.push("")
  return lines.join("\n")
}

const skillDirs = await listSkillDirs(SKILLS_DIR)
if (skillDirs.length === 0) {
  console.error("No skill directories found under src/skills/")
  process.exit(1)
}

const skills = []
for (const skillPath of skillDirs) {
  const skillMd = join(skillPath, "SKILL.md")
  const content = readFileSync(skillMd, "utf-8")
  const fm = parseFrontmatter(content)
  if (!fm) continue

  const name = stripQuotes(fm.fields.get("name") || "")
  const description = parseDescription(fm.raw)
  if (!name || !description) continue

  skills.push({ name, description, skillPath })
}

skills.sort((a, b) => a.name.localeCompare(b.name))

writeFileSync(LLMS_TXT, buildLlmsTxt(skills), "utf-8")
console.log(`Wrote ${LLMS_TXT} (${skills.length} skills).`)
