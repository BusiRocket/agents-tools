import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "../../fs/utils/listFilesRecursive"
import { sha256 } from "../../hash/utils/sha256"
import { normalizeRel } from "./normalizeRel"

export const checkCursorRules = async (
  sourceFiles: string[],
  sourceDir: string,
  cursorDir: string,
) => {
  const sourceMap = new Map()

  for (const sourcePath of sourceFiles) {
    const rel = normalizeRel(path.relative(sourceDir, sourcePath))
    const content = await fs.readFile(sourcePath, "utf-8")
    sourceMap.set(rel, sha256(content))
  }

  let cursorFiles
  try {
    cursorFiles = await listFilesRecursive(cursorDir)
  } catch {
    return ["Missing .cursor/rules directory"]
  }

  const cursorMap = new Map()
  for (const cursorPath of cursorFiles) {
    const rel = normalizeRel(path.relative(cursorDir, cursorPath))

    const content = await fs.readFile(cursorPath, "utf-8")
    cursorMap.set(rel, sha256(content))
  }

  const errors = []

  for (const [filePath, hash] of sourceMap.entries()) {
    if (!cursorMap.has(filePath)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      errors.push(`Missing generated file: .cursor/rules/${filePath}`)
      continue
    }

    if (cursorMap.get(filePath) !== hash) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      errors.push(`Outdated generated file: .cursor/rules/${filePath}`)
    }
  }

  for (const filePath of cursorMap.keys()) {
    if (!sourceMap.has(filePath)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      errors.push(`Unexpected generated file: .cursor/rules/${filePath}`)
    }
  }

  return errors
}
