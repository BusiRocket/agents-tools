import { promises as fs } from "node:fs"
import { pathExists } from "./pathExists.mjs"

/**
 * Backup an existing path: if symlink, record target; if file/dir, rename to .backup-{timestamp}.
 *
 * @param {string} targetPath - Path that may already exist
 * @returns {Promise<{ exists: boolean, symlink?: boolean, current?: string, backupPath?: string }>}
 */
export const backupExistingPath = async (targetPath) => {
  const exists = await pathExists(targetPath)
  if (!exists) {
    return { exists: false }
  }

  const stat = await fs.lstat(targetPath)
  if (stat.isSymbolicLink()) {
    const current = await fs.readlink(targetPath)
    return { exists: true, symlink: true, current }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupPath = `${targetPath}.backup-${timestamp}`
  await fs.rename(targetPath, backupPath)
  return { exists: true, symlink: false, backupPath }
}
