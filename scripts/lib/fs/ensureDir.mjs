import { promises as fs } from "node:fs"

/**
 * Ensure a directory exists (creates it recursively).
 *
 * @param {string} dirPath - Directory path
 * @returns {Promise<void>}
 */
export const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true })
}
