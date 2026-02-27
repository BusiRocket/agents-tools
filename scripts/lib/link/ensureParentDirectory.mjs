import { promises as fs } from "node:fs"
import path from "node:path"

/**
 * Ensure the parent directory of the given path exists (creates it recursively).
 *
 * @param {string} targetPath - File path whose parent directory to ensure
 * @returns {Promise<void>}
 */
export const ensureParentDirectory = async (targetPath) => {
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
}
