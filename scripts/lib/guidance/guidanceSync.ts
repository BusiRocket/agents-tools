import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { applyGuidanceResult } from "./applyGuidanceResult"
import { buildReconciliationPrompt } from "./buildReconciliationPrompt"
import { collectGuidanceSources } from "./collectGuidanceSources"
import { createGuidanceRunId } from "./createGuidanceRunId"
import { parseGuidancePolicy } from "./parseGuidancePolicy"
import { removeCreatedGuidanceStateDir } from "./removeCreatedGuidanceStateDir"
import { runReconciliationAgent } from "./runReconciliationAgent"
import { shouldRemoveGuidanceStateDir } from "./shouldRemoveGuidanceStateDir"
import { validateReconciliationResult } from "./validators/validateReconciliationResult"
import type { GuidanceRunReport } from "./types/GuidanceRunReport"
import type { GuidanceSyncOptions } from "./types/GuidanceSyncOptions"

export const guidanceSync = async (options: GuidanceSyncOptions): Promise<GuidanceRunReport> => {
  const runId = createGuidanceRunId()
  const lockPath = join(options.stateDir, "lock")
  const snapshotDir = join(options.stateDir, "runs", runId)
  let removeEmptyStateDir = false
  try {
    removeEmptyStateDir = await shouldRemoveGuidanceStateDir(
      options.stateDir,
      options.dryRun === true,
    )
    await mkdir(options.stateDir, { recursive: true, mode: 0o700 })
    await writeFile(lockPath, runId, { encoding: "utf8", flag: "wx", mode: 0o600 })
  } catch (error) {
    await removeCreatedGuidanceStateDir(options.stateDir, removeEmptyStateDir)
    return {
      ok: false,
      applied: false,
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
      return {
        ok: false,
        applied: false,
        runId,
        snapshotDir,
        errors: parsedPolicy.errors,
        warnings: [],
      }
    const sources = await collectGuidanceSources(options)
    const runStartedAt = new Date()
    const rawResult = await runReconciliationAgent(
      parsedPolicy.policy,
      buildReconciliationPrompt(parsedPolicy.policy, sources),
    )
    const validated = validateReconciliationResult(
      rawResult,
      parsedPolicy.policy,
      sources.hashes,
      runStartedAt,
      new Date(),
    )
    if (!validated.ok)
      return {
        ok: false,
        applied: false,
        runId,
        snapshotDir,
        errors: validated.errors,
        warnings: [],
      }
    const currentSources = await collectGuidanceSources(options)
    if (
      JSON.stringify(
        Object.entries(currentSources.hashes).toSorted(([left], [right]) =>
          left.localeCompare(right),
        ),
      ) !==
      JSON.stringify(
        Object.entries(sources.hashes).toSorted(([left], [right]) => left.localeCompare(right)),
      )
    )
      return {
        ok: false,
        applied: false,
        runId,
        snapshotDir,
        errors: ["guidance sources changed during reconciliation"],
        warnings: [],
      }
    if (options.dryRun === true)
      return {
        ok: true,
        applied: false,
        runId,
        snapshotDir,
        errors: [],
        warnings: [
          ...validated.result.warnings,
          "dry run validated successfully; no guidance files or snapshots were written",
        ],
      }
    const acceptedSnapshotDir = await applyGuidanceResult({
      ...options,
      runId,
      result: validated.result,
    })
    return {
      ok: true,
      applied: true,
      runId,
      snapshotDir: acceptedSnapshotDir,
      errors: [],
      warnings: validated.result.warnings,
    }
  } catch (error) {
    return {
      ok: false,
      applied: false,
      runId,
      snapshotDir,
      errors: [error instanceof Error ? error.message : "guidance reconciliation failed"],
      warnings: [],
    }
  } finally {
    await rm(lockPath, { force: true }).catch(() => undefined)
    await removeCreatedGuidanceStateDir(options.stateDir, removeEmptyStateDir)
  }
}
