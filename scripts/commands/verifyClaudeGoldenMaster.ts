import { CLAUDE_PATH } from "../constants/CLAUDE_PATH"
import { SOURCE_DIR } from "../constants/SOURCE_DIR"
import { listFilesRecursive } from "../lib/fs/utils/listFilesRecursive"
import { readIfExists } from "../lib/fs/utils/readIfExists"
import { generateBundle } from "../lib/rules/utils/generateBundle"
import { renderClaudeIndexOnly } from "../lib/rules/utils/renderClaudeIndexOnly"

/**
 * Assert CLAUDE.md on disk is byte-identical to freshly generated output (golden master).
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function verifyClaudeGoldenMaster() {
  try {
    const sourceFiles = await listFilesRecursive(SOURCE_DIR)

    const bundle = await generateBundle(sourceFiles, SOURCE_DIR)
    const generated = renderClaudeIndexOnly(bundle, {
      maxChars: 15_000,
      includeShortSummary: false,
    })
    const onDisk = await readIfExists(CLAUDE_PATH)
    if (onDisk === null) {
      return { ok: false, error: "CLAUDE.md not found (run pnpm rules:compile first)" }
    }
    if (onDisk !== generated) {
      return {
        ok: false,
        error: "CLAUDE.md is not byte-identical to generated output (golden master mismatch)",
      }
    }
    return { ok: true }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return { ok: false, error: String(err?.message ?? err) }
  }
}
