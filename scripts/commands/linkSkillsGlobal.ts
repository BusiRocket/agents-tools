import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "../lib/fs/utils/listFilesRecursive"
import { copySkillsToTarget } from "../lib/link/utils/copySkillsToTarget"
import { IDE_REGISTRY } from "../lib/link/constants/IDE_REGISTRY"
import { CANONICAL_SKILLS_DIR } from "../lib/link/constants/CANONICAL_SKILLS_DIR"
import { cleanGlobalPrefix } from "../lib/link/utils/cleanGlobalPrefix"
import { SKILLS_DIST_DIR } from "./constants/SKILLS_DIST_DIR"
import { processTarget } from "./utils/processTarget"

export const main = async () => {
  const allFiles = await listFilesRecursive(SKILLS_DIST_DIR)
  const skillDirsSet = new Set<string>()
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

  await fs.mkdir(CANONICAL_SKILLS_DIR, { recursive: true })

  const skillNames = skillDirs.map((dir) => path.relative(SKILLS_DIST_DIR, dir))

  await cleanGlobalPrefix(CANONICAL_SKILLS_DIR, "busirocket-")
  await cleanGlobalPrefix(CANONICAL_SKILLS_DIR, "brp-")
  await cleanGlobalPrefix(CANONICAL_SKILLS_DIR, "brp")
  await cleanGlobalPrefix(CANONICAL_SKILLS_DIR, "react-doctor")

  await copySkillsToTarget({
    sourceDir: SKILLS_DIST_DIR,
    targetDir: CANONICAL_SKILLS_DIR,
    skillNames,
    prefix: "",
  })

  // IDE_REGISTRY entries all have skillsDir defined
  const skillTargets = IDE_REGISTRY
  let linked = 0
  let skipped = 0

  for (const target of skillTargets) {
    const wasLinked = await processTarget(target, skillNames)
    if (wasLinked) {
      linked++
    } else {
      skipped++
    }
  }

  console.log(
    `\nDone: ${String(skillNames.length)} skills -> canonical product directory + ${String(linked)} IDE targets` +
      (skipped > 0 ? ` (${String(skipped)} skipped)` : ""),
  )
}
