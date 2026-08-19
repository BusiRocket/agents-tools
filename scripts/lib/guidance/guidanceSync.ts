import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { applyGuidanceResult } from "./applyGuidanceResult"
import { buildReconciliationPrompt } from "./buildReconciliationPrompt"
import { collectGuidanceSources } from "./collectGuidanceSources"
import { createGuidanceRunId } from "./createGuidanceRunId"
import { parseGuidancePolicy } from "./parseGuidancePolicy"
import { runReconciliationAgent } from "./runReconciliationAgent"
import { validateReconciliationResult } from "./validators/validateReconciliationResult"
import type { GuidanceRunReport } from "./types/GuidanceRunReport"
import type { GuidanceSyncOptions } from "./types/GuidanceSyncOptions"

export const guidanceSync = async (options: GuidanceSyncOptions): Promise<GuidanceRunReport> => {
  const runId = createGuidanceRunId()
  const lockPath = join(options.stateDir, "lock")
  const snapshotDir = join(options.stateDir, "runs", runId)
  try {
    await mkdir(options.stateDir, { recursive: true, mode: 0o700 })
    await writeFile(lockPath, runId, { encoding: "utf8", flag: "wx", mode: 0o600 })
  } catch (error) {
    return {
      ok: false,
      runId,
      snapshotDir,
      errors: [
        (error as NodeJS.ErrnoException).code === "EEXIST"
          ? "a guidance reconciliation run is already active"
          : "could not acquire guidance lock",
      ],
      warnings: [],
    }
  }
  try {
    const rawPolicy = JSON.parse(
      await readFile(join(options.canonicalDir, "policy.json"), "utf8"),
    ) as unknown
    const parsedPolicy = parseGuidancePolicy(rawPolicy)
    if (!parsedPolicy.ok)
      return { ok: false, runId, snapshotDir, errors: parsedPolicy.errors, warnings: [] }
    const sources = await collectGuidanceSources(options)
    const rawResult = await runReconciliationAgent(
      parsedPolicy.policy,
      buildReconciliationPrompt(parsedPolicy.policy, sources),
    )
    const validated = validateReconciliationResult(rawResult, parsedPolicy.policy, sources.hashes)
    if (!validated.ok)
      return { ok: false, runId, snapshotDir, errors: validated.errors, warnings: [] }
    const acceptedSnapshotDir = await applyGuidanceResult({
      ...options,
      runId,
      result: validated.result,
    })
    return {
      ok: true,
      runId,
      snapshotDir: acceptedSnapshotDir,
      errors: [],
      warnings: validated.result.warnings,
    }
  } catch (error) {
    return {
      ok: false,
      runId,
      snapshotDir,
      errors: [error instanceof Error ? error.message : "guidance reconciliation failed"],
      warnings: [],
    }
  } finally {
    await rm(lockPath, { force: true }).catch(() => undefined)
  }
}
