import { promises as fs } from "node:fs"
import path from "node:path"
import { ensureDir } from "../../fs/ensureDir.mjs"

/**
 * Write a rule file to disk, ensuring parent directory exists
 * @param {string} targetPath - Target file path
 * @param {string} content - File content
 * @returns {Promise<void>}
 */
export async function writeRuleFile(targetPath, content) {
  await ensureDir(path.dirname(targetPath))
  await fs.writeFile(targetPath, content, "utf8")
}
