import { promises as fs } from "node:fs"
import path from "node:path"
import { pathExists } from "./pathExists.mjs"

/**
 * Remove all entries matching a prefix from a directory.
 * Deletes symlinks, files, and directories that start with the given prefix.
 *
 * @param {string} targetDir - Directory to clean (e.g. ~/.cursor/skills)
 * @param {string} prefix - Prefix to match (e.g. "busirocket-")
 * @returns {Promise<string[]>} List of removed entry names
 */
export const cleanGlobalPrefix = async (targetDir, prefix) => {
  const exists = await pathExists(targetDir)
  if (!exists) {
    return []
  }

  const entries = await fs.readdir(targetDir)
  const removed = []

  for (const entry of entries) {
    if (!entry.startsWith(prefix)) {
      continue
    }

    const fullPath = path.join(targetDir, entry)
    const stat = await fs.lstat(fullPath)

    if (stat.isSymbolicLink()) {
      await fs.unlink(fullPath)
    } else if (stat.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true })
    } else {
      await fs.unlink(fullPath)
    }

    removed.push(entry)
  }

  return removed
}
