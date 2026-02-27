#!/usr/bin/env node
/**
 * Link skills globally: project source → canonical → all IDE targets.
 * Cleans stale busirocket-* entries before re-linking at each level.
 * Uses copy instead of symlink for IDEs that don't follow symlinks.
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import { copySkillsToTarget } from "./lib/link/copySkillsToTarget.mjs"
import { CANONICAL_SKILLS_DIR, IDE_REGISTRY } from "./lib/link/ideRegistry.mjs"
import { linkSkillsToTarget } from "./lib/link/linkSkillsToTarget.mjs"
import { pathExists } from "./lib/link/pathExists.mjs"

const ROOT = process.cwd()
const PREFIX = "busirocket-"
const SKILLS_SOURCE_DIR = path.join(ROOT, "src", "skills", "stacks")

const main = async () => {
  const entries = await fs.readdir(SKILLS_SOURCE_DIR, { withFileTypes: true })
  const skillNames = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(PREFIX))
    .map((entry) => entry.name)

  if (skillNames.length === 0) {
    console.log("No busirocket-* skills found in src/skills/stacks/.")
    return
  }

  // Step 1: project source → canonical (always symlink)
  const canonical = await linkSkillsToTarget({
    sourceDir: SKILLS_SOURCE_DIR,
    targetDir: CANONICAL_SKILLS_DIR,
    skillNames,
    prefix: PREFIX,
  })

  if (canonical.cleaned.length > 0) {
    console.log(`Canonical: cleaned ${canonical.cleaned.length} stale skill(s)`)
  }
  console.log(`Canonical: ${skillNames.length} skills linked to ${CANONICAL_SKILLS_DIR}`)

  // Step 2: canonical → each IDE target (only IDEs with skillsDir)
  const skillTargets = IDE_REGISTRY.filter((ide) => ide.skillsDir !== null)
  let linked = 0
  let skipped = 0

  for (const target of skillTargets) {
    const ideExists = await pathExists(target.rootDir)
    if (!ideExists) {
      console.log(`- ${target.id}: skipped (not installed)`)
      skipped++
      continue
    }

    const strategy = target.linkStrategy ?? "symlink"

    if (strategy === "copy") {
      const result = await copySkillsToTarget({
        sourceDir: CANONICAL_SKILLS_DIR,
        targetDir: target.skillsDir,
        skillNames,
        prefix: PREFIX,
      })

      const verb = result.copied.length > 0 ? "copied" : "unchanged"
      console.log(`+ ${target.id}: ${skillNames.length} skills (${verb})`)
    } else {
      await linkSkillsToTarget({
        sourceDir: CANONICAL_SKILLS_DIR,
        targetDir: target.skillsDir,
        skillNames,
        prefix: PREFIX,
      })

      console.log(`+ ${target.id}: ${skillNames.length} skills`)
    }

    linked++
  }

  console.log(
    `\nDone: ${skillNames.length} skills → canonical + ${linked} IDEs` +
      (skipped > 0 ? ` (${skipped} skipped)` : ""),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
