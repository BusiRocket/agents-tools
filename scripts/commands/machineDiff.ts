import { homedir } from "node:os"
import { ROOT } from "../constants/ROOT"
import { flagValue } from "../lib/machine/cli/flagValue"
import { loadMcpManifest } from "../lib/machine/cli/loadMcpManifest"
import { resolveOwnedPath } from "../lib/machine/cli/resolveOwnedPath"
import { resolveTargetPaths } from "../lib/machine/cli/resolveTargetPaths"
import { toOwnedByTarget } from "../lib/machine/cli/toOwnedByTarget"
import { plan } from "../lib/machine/domains/mcp/plan"
import { read } from "../lib/machine/domains/mcp/read"
import { resolveInstanceDir } from "../lib/machine/instance/resolveInstanceDir"
import { readOwned } from "../lib/machine/ownership/readOwned"
import { formatRunReport } from "../lib/machine/report/formatters/formatRunReport"
import type { RunReport } from "../lib/machine/types/RunReport"

export const main = async () => {
  const home = homedir()
  const asJson = process.argv.includes("--json")
  const flag = flagValue(process.argv, "--instance")

  const instanceDir = resolveInstanceDir({
    ...(flag === undefined ? {} : { flag }),
    env: process.env,
    root: ROOT,
  })

  const parsed = await loadMcpManifest(instanceDir)

  if (!parsed.ok) {
    const report: RunReport = {
      runId: "diff",
      profile: "full",
      domains: [{ domain: "mcp", status: "failed", changes: 0, messages: parsed.errors }],
      ok: false,
    }
    console.log(formatRunReport(report, asJson))
    process.exitCode = 1
    return
  }

  const paths = resolveTargetPaths(home)
  const owned = toOwnedByTarget(await readOwned(resolveOwnedPath(home)))

  const changes = plan({
    manifest: parsed.manifest,
    state: await read(paths),
    owned,
    env: process.env,
  })

  const report: RunReport = {
    runId: "diff",
    profile: "full",
    domains: [
      {
        domain: "mcp",
        status: changes.length === 0 ? "converged" : "changed",
        changes: changes.length,
        messages: changes.map((change) => `${change.operation} ${change.name} on ${change.target}`),
      },
    ],
    ok: true,
  }

  console.log(formatRunReport(report, asJson))
}
