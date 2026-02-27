import { promises as fs } from "node:fs"
import { cleanGlobalPrefix } from "./cleanGlobalPrefix.mjs"

/**
 * Clean stale entries matching a prefix and copy skills from source to target directory.
 * Used for IDEs that don't follow symlinks (e.g. Antigravity).
 *
 * @param {Object} options
 * @param {string} options.sourceDir - Directory containing skill folders to copy from
 * @param {string} options.targetDir - Directory to copy into
 * @param {string[]} options.skillNames - Names of skill folders to copy
 * @param {string} options.prefix - Prefix to clean (e.g. "busirocket-")
 * @returns {Promise<{ cleaned: string[], copied: string[] }>}
 */
export const copySkillsToTarget = async ({ sourceDir, targetDir, skillNames, prefix }) => {
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
