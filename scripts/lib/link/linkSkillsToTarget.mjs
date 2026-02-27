import { promises as fs } from "node:fs"
import { cleanGlobalPrefix } from "./cleanGlobalPrefix.mjs"
import { ensureParentDirectory } from "./ensureParentDirectory.mjs"
import { linkOneWithBackup } from "./linkOneWithBackup.mjs"

/**
 * Clean stale entries matching a prefix and symlink skills from source to target directory.
 *
 * @param {Object} options
 * @param {string} options.sourceDir - Directory containing skill folders to link from
 * @param {string} options.targetDir - Directory to create symlinks in
 * @param {string[]} options.skillNames - Names of skill folders to link
 * @param {string} options.prefix - Prefix to clean (e.g. "busirocket-")
 * @returns {Promise<{ cleaned: string[], linked: string[] }>}
 */
export const linkSkillsToTarget = async ({ sourceDir, targetDir, skillNames, prefix }) => {
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
