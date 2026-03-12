#!/usr/bin/env node
/**
 * Link skills globally: compiled product artifacts -> canonical directory -> IDE distribution targets.
 *
 * The canonical directory is an internal product-managed location. IDE destinations are also
 * managed by this linker and should not be described as vendor-documented native paths unless that
 * has been verified independently.
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"
import { copySkillsToTarget } from "./lib/link/copySkillsToTarget.mjs"
import { CANONICAL_SKILLS_DIR, IDE_REGISTRY } from "./lib/link/ideRegistry.mjs"
import { linkSkillsToTarget } from "./lib/link/linkSkillsToTarget.mjs"
import { pathExists } from "./lib/link/pathExists.mjs"

const ROOT = process.cwd()
const SKILLS_DIST_DIR = path.join(ROOT, "dist", "skills")

const main = async () => {
  // Discovery
  const allFiles = await listFilesRecursive(SKILLS_DIST_DIR)
  const skillDirsSet = new Set()
  for (const file of allFiles) {
    if (file.endsWith("SKILL.md")) {
      skillDirsSet.add(path.dirname(file))
    }
  }

  const skillDirs = Array.from(skillDirsSet)
  if (skillDirs.length === 0) {
    console.log("No skills found in dist/skills/.")
    return
  }

  // Stage compiled skills into the canonical product-managed directory first.
  await fs.mkdir(CANONICAL_SKILLS_DIR, { recursive: true })

  // Then use the canonical directory as the source for product-managed IDE fan-out.
  const { cleanGlobalPrefix } = await import("./lib/link/cleanGlobalPrefix.mjs")
  const { linkOneWithBackup } = await import("./lib/link/linkOneWithBackup.mjs")

  // Step 1: Clean old canonical directories (both old busirocket- and new brp-)
  await cleanGlobalPrefix(CANONICAL_SKILLS_DIR, "busirocket-")
  await cleanGlobalPrefix(CANONICAL_SKILLS_DIR, "brp-")
  await cleanGlobalPrefix(CANONICAL_SKILLS_DIR, "brp") // the orchestrator itself
  await cleanGlobalPrefix(CANONICAL_SKILLS_DIR, "react-doctor")

  const skillNames = []

  for (const skillDir of skillDirs) {
    const skillName = path.basename(skillDir)
    skillNames.push(skillName)
    const target = path.join(CANONICAL_SKILLS_DIR, skillName)
    await linkOneWithBackup({ source: skillDir, target })
  }

  console.log(
    `Canonical product directory: ${skillNames.length} skills linked to ${CANONICAL_SKILLS_DIR}`,
  )

  // Step 2: canonical -> IDE distribution targets managed by this product.
  const skillTargets = IDE_REGISTRY.filter((ide) => ide.skillsDir !== null)
  let linked = 0
  let skipped = 0

  // Use CANONICAL_SKILLS_DIR as sourceDir for linkSkillsToTarget / copySkillsToTarget
  for (const target of skillTargets) {
    const detectPaths = target.detectPaths ?? [target.rootDir]
    const detectResults = await Promise.all(detectPaths.map((candidate) => pathExists(candidate)))
    const ideExists = detectResults.some(Boolean)
    if (!ideExists) {
      console.log(`- ${target.id}: skipped (target root not detected)`)
      skipped++
      continue
    }

    // Clean both old prefix "busirocket-" and new "brp-" or no prefix
    await cleanGlobalPrefix(target.skillsDir, "busirocket-")
    await cleanGlobalPrefix(target.skillsDir, "brp-")
    await cleanGlobalPrefix(target.skillsDir, "brp")
    await cleanGlobalPrefix(target.skillsDir, "react-doctor")

    const strategy = target.linkStrategy ?? "symlink"

    if (strategy === "copy") {
      const result = await copySkillsToTarget({
        sourceDir: CANONICAL_SKILLS_DIR,
        targetDir: target.skillsDir,
        skillNames,
        prefix: "", // We just cleaned above, and pass "" to avoid re-cleaning inside with a single prefix
      })
      const verb = result.copied.length > 0 ? "copied" : "unchanged"
      console.log(`+ ${target.id}: ${skillNames.length} skills distributed via copy (${verb})`)
    } else {
      await linkSkillsToTarget({
        sourceDir: CANONICAL_SKILLS_DIR,
        targetDir: target.skillsDir,
        skillNames,
        prefix: "",
      })
      console.log(`+ ${target.id}: ${skillNames.length} skills distributed via symlink`)
    }

    linked++
  }

  console.log(
    `\nDone: ${skillNames.length} skills -> canonical product directory + ${linked} IDE targets` +
      (skipped > 0 ? ` (${skipped} skipped)` : ""),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
