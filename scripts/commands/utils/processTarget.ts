import type { IdeRegistryEntry } from "../../lib/link/types/IdeRegistryEntry"
import { CANONICAL_SKILLS_DIR } from "../../lib/link/constants/CANONICAL_SKILLS_DIR"
import { copySkillsToTarget } from "../../lib/link/utils/copySkillsToTarget"
import { linkSkillsToTarget } from "../../lib/link/utils/linkSkillsToTarget"
import { pathExists } from "../../lib/link/utils/pathExists"
import { cleanGlobalPrefix } from "../../lib/link/utils/cleanGlobalPrefix"

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

  if (strategy === "copy") {
    const result = await copySkillsToTarget({
      sourceDir: CANONICAL_SKILLS_DIR,
      targetDir: target.skillsDir,
      skillNames,
      prefix: "",
      flatten,
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
      flatten,
    })
    console.log(`+ ${target.id}: ${String(skillNames.length)} skills distributed via symlink`)
  }

  return true
}
