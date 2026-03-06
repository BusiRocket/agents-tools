#!/usr/bin/env node
/**
 * Legacy version check replaced by contract check:
 * ensure source SKILL frontmatter only contains name + description.
 */

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"
import { parseFrontmatter } from "./lib/skills/frontmatter.mjs"

const ROOT = process.cwd()
const SKILLS_DIR = join(ROOT, "src", "skills")

const skillDirs = await listSkillDirs(SKILLS_DIR)
if (skillDirs.length === 0) {
  console.error("No source skills found under src/skills")
  process.exit(1)
}

const violations = []
for (const skillPath of skillDirs) {
  const skillMdPath = join(skillPath, "SKILL.md")
  const content = readFileSync(skillMdPath, "utf8")
  const fm = parseFrontmatter(content)
  if (!fm) {
    violations.push(`${skillMdPath}: missing frontmatter`)
    continue
  }

  const keys = Array.from(fm.fields.keys())
  const unexpected = keys.filter((key) => key !== "name" && key !== "description")
  if (unexpected.length > 0) {
    violations.push(`${skillMdPath}: unexpected frontmatter fields (${unexpected.join(", ")})`)
  }
}

if (violations.length > 0) {
  console.error("Skill frontmatter contract violations detected:")
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log(`Frontmatter contract OK (${skillDirs.length} skills).`)
