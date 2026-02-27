import { promises as fs } from "node:fs"

/**
 * Check if a path exists (file, directory, or symlink).
 *
 * @param {string} targetPath - Path to check
 * @returns {Promise<boolean>} - True if path exists
 */
export const pathExists = async (targetPath) => {
  try {
    await fs.lstat(targetPath)
    return true
  } catch {
    return false
  }
}
