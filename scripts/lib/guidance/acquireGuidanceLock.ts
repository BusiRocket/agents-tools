import { writeFile } from "node:fs/promises"
import { createGuidanceLockRelease } from "./createGuidanceLockRelease"
import { readGuidanceLockActivity } from "./readGuidanceLockActivity"
import { reclaimGuidanceLock } from "./reclaimGuidanceLock"

export const acquireGuidanceLock = async (
  lockPath: string,
  runId: string,
  staleAfterMs: number,
): Promise<() => Promise<void>> => {
  const owner = `${JSON.stringify({ pid: process.pid, runId })}\n`
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await writeFile(lockPath, owner, { encoding: "utf8", flag: "wx", mode: 0o600 })
      return createGuidanceLockRelease(lockPath, owner)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST")
        throw new Error("could not acquire guidance lock", { cause: error })
    }
    const ownerIsRunning = await readGuidanceLockActivity(lockPath, staleAfterMs)
    if (ownerIsRunning === undefined) continue
    if (ownerIsRunning) throw new Error("a guidance reconciliation run is already active")
    const stalePath = `${lockPath}.stale.${runId}`
    await reclaimGuidanceLock(lockPath, stalePath)
  }
  throw new Error("could not acquire guidance lock")
}
