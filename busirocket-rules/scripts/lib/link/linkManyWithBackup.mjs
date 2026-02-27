import { linkOneWithBackup } from "./linkOneWithBackup.mjs"

/**
 * Create symlinks for multiple source-target pairs, backing up existing targets.
 *
 * @param {{ source: string, target: string }[]} links - Array of { source, target }
 * @returns {Promise<Array<{ target: string, source: string, status: string, backupPath?: string | null }>>}
 */
export const linkManyWithBackup = async (links) => {
  const results = []

  for (const link of links) {
    results.push(await linkOneWithBackup(link))
  }

  return results
}
