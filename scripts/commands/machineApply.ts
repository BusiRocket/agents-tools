import { promises as fs } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { flagValue } from "../lib/machine/cli/flagValue"
import { loadMcpManifest } from "../lib/machine/cli/loadMcpManifest"
import { resolveOwnedPath } from "../lib/machine/cli/resolveOwnedPath"
import { resolveRunsDir } from "../lib/machine/cli/resolveRunsDir"
import { resolveTargetPaths } from "../lib/machine/cli/resolveTargetPaths"
import { toOwnedByTarget } from "../lib/machine/cli/toOwnedByTarget"
import { apply } from "../lib/machine/domains/mcp/apply"
import { resolveInstanceDir } from "../lib/machine/instance/resolveInstanceDir"
import { readOwned } from "../lib/machine/ownership/readOwned"
import { writeOwned } from "../lib/machine/ownership/writeOwned"
import { formatRunReport } from "../lib/machine/report/formatters/formatRunReport"
import { createRunId } from "../lib/machine/runs/createRunId"
import { createSnapshot } from "../lib/machine/runs/createSnapshot"
import type { RunReport } from "../lib/machine/types/RunReport"

export const main = async () => {
  const home = homedir()
  const asJson = process.argv.includes("--json")
  const flag = flagValue(process.argv, "--instance")

  const instanceDir = resolveInstanceDir({
    ...(flag === undefined ? {} : { flag }),
    env: process.env,
    home,
  })

  const parsed = await loadMcpManifest(instanceDir)

  if (!parsed.ok) {
    const report: RunReport = {
      runId: "apply",
      profile: "full",
      domains: [{ domain: "mcp", status: "failed", changes: 0, messages: parsed.errors }],
      ok: false,
    }
    console.log(formatRunReport(report, asJson))
    process.exitCode = 1
    return
  }

  const paths = resolveTargetPaths(home)
  const ownedPath = resolveOwnedPath(home)
  const ownedRecord = await readOwned(ownedPath)

  const runId = createRunId(new Date(), Math.random)
  const runDir = join(resolveRunsDir(home), runId)
  await createSnapshot({ runDir, files: [...Object.values(paths), ownedPath] })

  const result = await apply({
    manifest: parsed.manifest,
    paths,
    owned: toOwnedByTarget(ownedRecord),
    env: process.env,
  })

  await writeOwned(ownedPath, { ...ownedRecord, mcp: result.owned })
  await fs.writeFile(join(runDir, "complete"), "")

  const written = Object.values(result.owned).reduce((total, names) => total + names.length, 0)
  const missing = [...new Set(result.missing)]

  const report: RunReport = {
    runId,
    profile: "full",
    domains: [
      {
        domain: "mcp",
        status: missing.length > 0 ? "needs-secret" : "changed",
        changes: written,
        messages:
          missing.length > 0
            ? [`unresolved secret references: ${missing.join(", ")}`]
            : [
                `wrote ${String(written)} server entries across ${String(Object.keys(paths).length)} targets`,
              ],
      },
    ],
    ok: true,
  }

  console.log(formatRunReport(report, asJson))
}
