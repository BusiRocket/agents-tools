import type { IdeRegistryEntry } from "../../lib/link/types/IdeRegistryEntry"
import { CANONICAL_SKILLS_DIR } from "../../lib/link/constants/CANONICAL_SKILLS_DIR"
import { CANONICAL_SKILLS_PORTABLE_DIR } from "../../lib/link/constants/CANONICAL_SKILLS_PORTABLE_DIR"
import { copySkillsToTarget } from "../../lib/link/operations/copySkillsToTarget"
import { linkSkillsToTarget } from "../../lib/link/operations/linkSkillsToTarget"
import { pathExists } from "../../lib/link/operations/pathExists"
import { cleanGlobalPrefix } from "../../lib/link/operations/cleanGlobalPrefix"

export const processTarget = async (
  target: IdeRegistryEntry,
  skillNames: string[],
): Promise<boolean> => {
  const detectPaths = target.detectPaths ?? (target.rootDir ? [target.rootDir] : [])
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
  const flatten = target.flattenSkills ?? false
  const bundle = target.skillsBundle ?? "portable"
  const sourceDir = bundle === "claude" ? CANONICAL_SKILLS_DIR : CANONICAL_SKILLS_PORTABLE_DIR

  if (strategy === "copy") {
    const result = await copySkillsToTarget({
      sourceDir,
      targetDir: target.skillsDir,
      skillNames,
      prefix: "",
      flatten,
    })
    const verb = result.copied.length > 0 ? "copied" : "unchanged"
    console.log(
      `+ ${target.id}: ${String(skillNames.length)} skills (${bundle}) distributed via copy (${verb})`,
    )
  } else {
    await linkSkillsToTarget({
      sourceDir,
      targetDir: target.skillsDir,
      skillNames,
      prefix: "",
      flatten,
    })
    console.log(
      `+ ${target.id}: ${String(skillNames.length)} skills (${bundle}) distributed via symlink`,
    )
  }

  return true
}
