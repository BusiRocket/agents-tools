import { promises as fs } from "node:fs"
import path from "node:path"
import { ensureDir } from "../fs/ensureDir.mjs"

/**
 * Sync .cursor/rules by clearing target and copying all source files.
 *
 * @param {string[]} sourceFiles - Full paths to source files
 * @param {string} sourceDir - Base directory for source
 * @param {string} cursorDir - .cursor/rules directory
 * @returns {Promise<void>}
 */
export const syncCursorRules = async (sourceFiles, sourceDir, cursorDir) => {
  await fs.rm(cursorDir, { recursive: true, force: true })
  await ensureDir(cursorDir)

  for (const sourcePath of sourceFiles) {
    const relativePath = path.relative(sourceDir, sourcePath)
    const targetPath = path.join(cursorDir, relativePath)
    await ensureDir(path.dirname(targetPath))
    await fs.copyFile(sourcePath, targetPath)
  }
}
