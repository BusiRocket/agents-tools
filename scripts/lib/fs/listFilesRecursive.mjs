import { promises as fs } from "node:fs"
import path from "node:path"

const defaultIsIgnored = (entryName) => entryName === ".DS_Store"

/**
 * List all file paths under a directory recursively (sorted).
 *
 * @param {string} dirPath - Root directory path
 * @param {(entryName: string) => boolean} [isIgnored] - Predicate to skip entries (default: skip .DS_Store)
 * @returns {Promise<string[]>} - Sorted array of full file paths
 */
export const listFilesRecursive = async (dirPath, isIgnored = defaultIsIgnored) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const results = []

  for (const entry of entries) {
    if (isIgnored(entry.name)) {
      continue
    }

    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      const nested = await listFilesRecursive(fullPath, isIgnored)
      results.push(...nested)
      continue
    }

    if (entry.isFile()) {
      results.push(fullPath)
    }
  }

  return results.sort((a, b) => a.localeCompare(b))
}
