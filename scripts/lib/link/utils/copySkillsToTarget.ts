import { promises as fs } from "node:fs"
import { cleanGlobalPrefix } from "./cleanGlobalPrefix"

export const copySkillsToTarget = async ({
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

  const cleaned = await cleanGlobalPrefix(targetDir, prefix)

  const copied = []

  for (const skillName of skillNames) {
    const source = `${sourceDir}/${skillName}`
    const target = `${targetDir}/${skillName}`

    await fs.rm(target, { recursive: true, force: true })
    await fs.cp(source, target, { recursive: true, dereference: true })

    copied.push(skillName)
  }

  return { cleaned, copied }
}
