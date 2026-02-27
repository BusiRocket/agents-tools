import { promises as fs } from "node:fs"

/**
 * Read file contents if the file exists; otherwise return null.
 *
 * @param {string} filePath - Path to the file
 * @param {string} [encoding="utf8"] - File encoding
 * @returns {Promise<string | null>}
 */
export const readIfExists = async (filePath, encoding = "utf8") => {
  try {
    return await fs.readFile(filePath, encoding)
  } catch {
    return null
  }
}
