import { promises as fs } from "node:fs"
import path from "node:path"
import { parseMdc } from "../parseMdc.mjs"

/**
 * Process a single source file: read, parse, and get relative path
 * @param {string} file - File path
 * @param {string} sourceDir - Source directory
 * @returns {Promise<{content: string, parsed: object, relativePath: string}>}
 */
export async function processSourceFile(file, sourceDir) {
  const content = await fs.readFile(file, "utf8")
  const parsed = parseMdc(content)
  const relativePath = path.relative(sourceDir, file)
  // Normalize: parseMdc returns body; consumers (toAntigravityRule, toWindsurfRule) expect content
  const parsedWithContent = { ...parsed, content: parsed.body ?? "" }

  return { content, parsed: parsedWithContent, relativePath }
}
