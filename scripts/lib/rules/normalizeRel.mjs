import path from "node:path"

/**
 * Get path relative to base directory with forward slashes.
 *
 * @param {string} baseDir - Base directory
 * @param {string} filePath - Absolute or relative file path
 * @returns {string} - Relative path with "/" separators
 */
export const normalizeRel = (baseDir, filePath) =>
  path.relative(baseDir, filePath).split(path.sep).join("/")
