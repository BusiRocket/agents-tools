import path from "node:path"
import { ensureDir } from "../../fs/utils/ensureDir"
import { processSourceFile } from "../helpers/utils/processSourceFile"
import { writeRuleFile } from "../helpers/utils/writeRuleFile"
import { toWindsurfRule } from "./toWindsurfRule"

/**
 * Sync rules to Windsurf format (.windsurf/rules/)
 * @param {string[]} sourceFiles - Array of source .mdc files
 * @param {string} sourceDir - Source directory path
 * @param {string} targetDir - Target .windsurf/rules directory
 */
export async function syncWindsurfRules(
  sourceFiles: string[],
  sourceDir: string,
  targetDir: string,
) {
  await ensureDir(targetDir)
  for (const file of sourceFiles) {
    const { parsed, relativePath } = await processSourceFile(file, sourceDir)
    const converted = toWindsurfRule(parsed, relativePath)
    const targetPath = path.join(targetDir, relativePath.replace(/\.mdc$/, ".md"))
    await writeRuleFile(targetPath, converted)
  }
}
