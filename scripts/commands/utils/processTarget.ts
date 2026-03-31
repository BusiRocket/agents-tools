import type { IDE_REGISTRY } from "../../lib/link/constants/IDE_REGISTRY"
import { CANONICAL_SKILLS_DIR } from "../../lib/link/constants/CANONICAL_SKILLS_DIR"
import { copySkillsToTarget } from "../../lib/link/utils/copySkillsToTarget"
import { linkSkillsToTarget } from "../../lib/link/utils/linkSkillsToTarget"
import { pathExists } from "../../lib/link/utils/pathExists"
import { cleanGlobalPrefix } from "../../lib/link/utils/cleanGlobalPrefix"

export const processTarget = async (
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
