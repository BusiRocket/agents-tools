import { promises as fs } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { ROOT } from "../constants/ROOT"
import { flagValue } from "../lib/machine/cli/flagValue"
import { loadMcpManifest } from "../lib/machine/cli/loadMcpManifest"
import { loadSecurityManifest } from "../lib/machine/cli/loadSecurityManifest"
import { resolveCapabilityTargets } from "../lib/machine/cli/resolveCapabilityTargets"
import { resolveClaudeSettingsPaths } from "../lib/machine/cli/resolveClaudeSettingsPaths"
import { resolveOwnedPath } from "../lib/machine/cli/resolveOwnedPath"
import { resolveRunsDir } from "../lib/machine/cli/resolveRunsDir"
import { resolveTargetPaths } from "../lib/machine/cli/resolveTargetPaths"
import { toOwnedByTarget } from "../lib/machine/cli/toOwnedByTarget"
import { apply } from "../lib/machine/domains/mcp/apply"
import { applyCapabilityLinks } from "../lib/machine/domains/capabilities/applyCapabilityLinks"
import { planCapabilityLinks } from "../lib/machine/domains/capabilities/planCapabilityLinks"
import { planClaudeSettings } from "../lib/machine/domains/security/planClaudeSettings"
import { readClaudeSettings } from "../lib/machine/domains/security/readClaudeSettings"
import { writeClaudeSettings } from "../lib/machine/domains/security/writeClaudeSettings"
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
    root: ROOT,
  })

  const parsed = await loadMcpManifest(instanceDir)
  const security = await loadSecurityManifest(instanceDir)

  if (!parsed.ok || !security.ok) {
    const errors = [...(parsed.ok ? [] : parsed.errors), ...(security.ok ? [] : security.errors)]
    const report: RunReport = {
      runId: "apply",
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
  const ownedPath = resolveOwnedPath(home)
  const ownedRecord = await readOwned(ownedPath)
  const capabilityTargets = resolveCapabilityTargets()
  const capabilityPlans = await Promise.all(
    capabilityTargets.map(async (target) => ({
      target,
      changes: await planCapabilityLinks(target),
    })),
  )
  const capabilitySnapshotPaths = [
    ...new Set(capabilityPlans.flatMap(({ changes }) => changes.map(({ target }) => target))),
  ]

  const runId = createRunId(new Date(), Math.random)
  const runDir = join(resolveRunsDir(home), runId)
  await createSnapshot({
    runDir,
    files: [
      ...Object.values(paths),
      claudeSettingsPaths["claude-personal"],
      claudeSettingsPaths["claude-favish"],
      ownedPath,
      ...capabilitySnapshotPaths,
    ],
  })

  const securityChanges = planClaudeSettings(
    security.manifest.claude,
    await readClaudeSettings(claudeSettingsPaths),
  )

  const result = await apply({
    manifest: parsed.manifest,
    paths,
    owned: toOwnedByTarget(ownedRecord),
    env: process.env,
  })
  const securityOwned = await writeClaudeSettings({
    paths: claudeSettingsPaths,
    policy: security.manifest.claude,
  })
  const capabilityResults = []
  for (const target of capabilityTargets) {
    capabilityResults.push({ target, result: await applyCapabilityLinks(target) })
  }

  const capabilityOwned = Object.fromEntries(
    capabilityResults
      .filter(({ result }) => result.status === "supported")
      .map(({ target }) => [target.id, target.links.map(({ target: path }) => path)]),
  )

  await writeOwned(ownedPath, {
    ...ownedRecord,
    mcp: result.owned,
    security: securityOwned,
    capabilities: capabilityOwned,
  })
  await fs.writeFile(join(runDir, "complete"), "")

  const written = Object.values(result.owned).reduce((total, names) => total + names.length, 0)
  const missing = [...new Set(result.missing)]
  const capabilityChanges = capabilityPlans.reduce(
    (total, capabilityPlan) => total + capabilityPlan.changes.length,
    0,
  )

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
      {
        domain: "security",
        status: securityChanges.length === 0 ? "converged" : "changed",
        changes: securityChanges.length,
        messages: securityChanges.map((change) => `updated ${change.key} on ${change.profile}`),
      },
      {
        domain: "capabilities",
        status: capabilityChanges === 0 ? "converged" : "changed",
        changes: capabilityChanges,
        messages: capabilityResults.flatMap(({ target, result: capabilityResult }) => {
          if (capabilityResult.status === "unavailable")
            return [`skipped ${target.id}: unavailable`]
          if (capabilityResult.status === "unsupported")
            return [`skipped ${target.id}: unsupported`]
          const changed = capabilityResult.linked + capabilityResult.copied
          return changed === 0 ? [] : [`updated ${String(changed)} paths for ${target.id}`]
        }),
      },
    ],
    ok: true,
  }

  console.log(formatRunReport(report, asJson))
}
