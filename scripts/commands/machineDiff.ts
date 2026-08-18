import { homedir } from "node:os"
import { ROOT } from "../constants/ROOT"
import { flagValue } from "../lib/machine/cli/flagValue"
import { loadMcpManifest } from "../lib/machine/cli/loadMcpManifest"
import { loadSecurityManifest } from "../lib/machine/cli/loadSecurityManifest"
import { resolveCapabilityTargets } from "../lib/machine/cli/resolveCapabilityTargets"
import { resolveClaudeSettingsPaths } from "../lib/machine/cli/resolveClaudeSettingsPaths"
import { resolveOwnedPath } from "../lib/machine/cli/resolveOwnedPath"
import { resolveTargetPaths } from "../lib/machine/cli/resolveTargetPaths"
import { toOwnedByTarget } from "../lib/machine/cli/toOwnedByTarget"
import { plan } from "../lib/machine/domains/mcp/plan"
import { read } from "../lib/machine/domains/mcp/read"
import { planCapabilityLinks } from "../lib/machine/domains/capabilities/planCapabilityLinks"
import { planClaudeSettings } from "../lib/machine/domains/security/planClaudeSettings"
import { readClaudeSettings } from "../lib/machine/domains/security/readClaudeSettings"
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
  const security = await loadSecurityManifest(instanceDir)

  if (!parsed.ok || !security.ok) {
    const errors = [...(parsed.ok ? [] : parsed.errors), ...(security.ok ? [] : security.errors)]
    const report: RunReport = {
      runId: "diff",
      profile: "full",
      domains: [{ domain: "machine", status: "failed", changes: 0, messages: errors }],
      ok: false,
    }
    console.log(formatRunReport(report, asJson))
    process.exitCode = 1
    return
  }

  const paths = resolveTargetPaths(home)
  const claudeSettingsPaths = resolveClaudeSettingsPaths(home)
  const owned = toOwnedByTarget(await readOwned(resolveOwnedPath(home)))

  const changes = plan({
    manifest: parsed.manifest,
    state: await read(paths),
    owned,
    env: process.env,
  })
  const securityChanges = planClaudeSettings(
    security.manifest.claude,
    await readClaudeSettings(claudeSettingsPaths),
  )
  const capabilityTargets = resolveCapabilityTargets()
  const capabilityPlans = await Promise.all(
    capabilityTargets.map(async (target) => ({
      target,
      changes: await planCapabilityLinks(target),
    })),
  )
  const capabilityChanges = capabilityPlans.flatMap(({ target, changes }) =>
    changes.map((change) => ({ ...change, id: target.id })),
  )

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
      {
        domain: "security",
        status: securityChanges.length === 0 ? "converged" : "changed",
        changes: securityChanges.length,
        messages: securityChanges.map((change) => `update ${change.key} on ${change.profile}`),
      },
      {
        domain: "capabilities",
        status: capabilityChanges.length === 0 ? "converged" : "changed",
        changes: capabilityChanges.length,
        messages: capabilityChanges.map(
          (change) => `${change.operation} ${change.target} for ${change.id}`,
        ),
      },
    ],
    ok: true,
  }

  console.log(formatRunReport(report, asJson))
}
