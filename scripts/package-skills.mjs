#!/usr/bin/env node
import { promises as fs } from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"
import { parseFrontmatter, stripQuotes } from "./lib/skills/frontmatter.mjs"

const ROOT = process.cwd()
const DIST_SKILLS_DIR = path.join(ROOT, "dist", "skills")
const DIST_PACKAGES_DIR = path.join(ROOT, "dist", "packages", "skills")

const buildZip = (sourceDir, targetZip) => {
  const parent = path.dirname(sourceDir)
  const folder = path.basename(sourceDir)
  const result = spawnSync("zip", ["-qr", targetZip, folder], {
    cwd: parent,
    stdio: "pipe",
    encoding: "utf8",
  })

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Failed to package ${sourceDir}`)
  }
}

const main = async () => {
  const skillDirs = await listSkillDirs(DIST_SKILLS_DIR)
  if (skillDirs.length === 0) {
    throw new Error("No compiled skills found in dist/skills. Run pnpm run skills:compile first.")
  }

  await fs.rm(DIST_PACKAGES_DIR, { recursive: true, force: true })
  await fs.mkdir(DIST_PACKAGES_DIR, { recursive: true })

  for (const skillDir of skillDirs) {
    const skillMd = await fs.readFile(path.join(skillDir, "SKILL.md"), "utf8")
    const frontmatter = parseFrontmatter(skillMd)
    const skillName = stripQuotes(frontmatter?.fields.get("name") || path.basename(skillDir))
    const targetZip = path.join(DIST_PACKAGES_DIR, `${skillName}.zip`)

    buildZip(skillDir, targetZip)
    console.log(`✓ ${targetZip}`)
  }

  console.log(`\nPackaged ${skillDirs.length} skills to ${DIST_PACKAGES_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
