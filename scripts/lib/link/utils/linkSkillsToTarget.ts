import { promises as fs } from "node:fs"
import { cleanGlobalPrefix } from "./cleanGlobalPrefix"
import { ensureParentDirectory } from "./ensureParentDirectory"
import { linkOneWithBackup } from "./linkOneWithBackup"

export const linkSkillsToTarget = async ({
  sourceDir,
  targetDir,
  skillNames,
  prefix,
}: {
  sourceDir: string
  targetDir: string
  skillNames: string[]
  prefix: string
}) => {
  await fs.mkdir(targetDir, { recursive: true })
  await ensureParentDirectory(targetDir + "/_")

  const cleaned = await cleanGlobalPrefix(targetDir, prefix)

  const linked = []

  for (const skillName of skillNames) {
    const source = `${sourceDir}/${skillName}`
    const target = `${targetDir}/${skillName}`
    const result = await linkOneWithBackup({ source, target })

    if (result.status !== "unchanged") {
      linked.push(skillName)
    }
  }

  return { cleaned, linked }
}
