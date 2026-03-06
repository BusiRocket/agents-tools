import path from "node:path"
import { listFilesRecursive } from "../fs/listFilesRecursive.mjs"

/**
 * Return absolute directories that contain SKILL.md under baseDir.
 * @param {string} baseDir
 * @returns {Promise<string[]>}
 */
export const listSkillDirs = async (baseDir) => {
  const files = await listFilesRecursive(baseDir)
  const dirs = new Set()

  for (const file of files) {
    if (path.basename(file) === "SKILL.md") {
      dirs.add(path.dirname(file))
    }
  }

  return Array.from(dirs).sort((a, b) => a.localeCompare(b))
}
