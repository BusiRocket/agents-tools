import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "../lib/fs/utils/listFilesRecursive"
import { copySkillsToTarget } from "../lib/link/utils/copySkillsToTarget"
import { IDE_REGISTRY } from "../lib/link/constants/IDE_REGISTRY"
import { CANONICAL_SKILLS_DIR } from "../lib/link/constants/CANONICAL_SKILLS_DIR"
import { linkSkillsToTarget } from "../lib/link/utils/linkSkillsToTarget"
import { pathExists } from "../lib/link/utils/pathExists"
import { cleanGlobalPrefix } from "../lib/link/utils/cleanGlobalPrefix"

const ROOT = process.cwd()
const SKILLS_DIST_DIR = path.join(ROOT, "dist", "skills")

const processTarget = async (
  target: (typeof IDE_REGISTRY)[number],
  skillNames: string[],
): Promise<boolean> => {
  const detectPaths = target.detectPaths ?? [target.rootDir]
  const detectResults = await Promise.all(detectPaths.map((candidate) => pathExists(candidate)))
  const ideExists = detectResults.some(Boolean)
  if (!ideExists) {
    console.log(`- ${target.id}: skipped (target root not detected)`)
    return false
  }

  await cleanGlobalPrefix(target.skillsDir, "busirocket-")
  await cleanGlobalPrefix(target.skillsDir, "brp-")
  await cleanGlobalPrefix(target.skillsDir, "brp")
  await cleanGlobalPrefix(target.skillsDir, "react-doctor")

  const strategy = target.linkStrategy

  if (strategy === "copy") {
    const result = await copySkillsToTarget({
      sourceDir: CANONICAL_SKILLS_DIR,
      targetDir: target.skillsDir,
      skillNames,
      prefix: "",
    })
    const verb = result.copied.length > 0 ? "copied" : "unchanged"
    console.log(
      `+ ${target.id}: ${String(skillNames.length)} skills distributed via copy (${verb})`,
    )
  } else {
    await linkSkillsToTarget({
      sourceDir: CANONICAL_SKILLS_DIR,
      targetDir: target.skillsDir,
      skillNames,
      prefix: "",
    })
    console.log(`+ ${target.id}: ${String(skillNames.length)} skills distributed via symlink`)
  }

  return true
}

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

if (import.meta.url === `file://${String(process.argv[1])}`) {
  main().catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
}
