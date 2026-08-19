import { chmod, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { createGuidanceSnapshot } from "./createGuidanceSnapshot"
import { guidanceTargets } from "./guidanceTargets"
import { restoreGuidanceSnapshot } from "./restoreGuidanceSnapshot"
import { writeGuidanceAtomically } from "./writeGuidanceAtomically"
import type { ReconciliationResult } from "./types/ReconciliationResult"

export const applyGuidanceResult = async (options: {
  home: string
  canonicalDir: string
  stateDir: string
  runId: string
  result: ReconciliationResult
}): Promise<string> => {
  const snapshotDir = join(options.stateDir, "runs", options.runId)
  const targets = guidanceTargets(options)
  await createGuidanceSnapshot({ snapshotDir, targets })
  const writes: [string, string][] = [
    [targets["canonical/shared.md"], options.result.shared],
    [targets["canonical/claude-overlay.md"], options.result.claudeOverlay],
    [targets["canonical/codex-overlay.md"], options.result.codexOverlay],
    [targets["live/claude/CLAUDE.md"], options.result.claudeDocument],
    [targets["live/codex/AGENTS.md"], options.result.codexDocument],
    [
      targets["state/accepted.json"],
      `${JSON.stringify({ runId: options.runId, acceptedAt: new Date().toISOString(), inputHashes: options.result.inputHashes }, null, 2)}\n`,
    ],
  ]
  try {
    for (const [target, content] of writes) await writeGuidanceAtomically(target, content)
    await mkdir(snapshotDir, { recursive: true, mode: 0o700 })
    await writeFile(join(snapshotDir, "complete"), "", { mode: 0o600, flag: "wx" })
    await chmod(join(snapshotDir, "complete"), 0o400)
    return snapshotDir
  } catch (error) {
    await restoreGuidanceSnapshot(snapshotDir, targets).catch(() => undefined)
    throw error
  }
}
