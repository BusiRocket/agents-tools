import { homedir } from "node:os"
import { ROOT } from "../constants/ROOT"
import { connectorExitCode } from "../lib/connectors/connectorExitCode"
import { inspectProfileConnectors } from "../lib/connectors/inspectProfileConnectors"
import { loadConnectorManifest } from "../lib/connectors/loadConnectorManifest"
import { resolveConnectorProfiles } from "../lib/connectors/resolveConnectorProfiles"
import { flagValue } from "../lib/machine/cli/flagValue"
import { resolveInstanceDir } from "../lib/machine/instance/resolveInstanceDir"

export const main = async () => {
  const instance = flagValue(process.argv, "--instance")
  const instanceDir = resolveInstanceDir({
    ...(instance === undefined ? {} : { flag: instance }),
    env: process.env,
    root: ROOT,
  })
  const parsed = await loadConnectorManifest(instanceDir)
  if (!parsed.ok) {
    console.log(JSON.stringify({ ok: false, errors: parsed.errors }, null, 2))
    process.exitCode = 2
    return
  }
  const requested = flagValue(process.argv, "--profile")
  const profiles = resolveConnectorProfiles(requested)
  const results = (
    await Promise.all(
      profiles.map((profile) =>
        inspectProfileConnectors(profile, parsed.manifest.connectors, homedir()),
      ),
    )
  ).flat()
  const exitCode = connectorExitCode(results)
  console.log(JSON.stringify({ ok: exitCode === 0, connectors: results }, null, 2))
  process.exitCode = exitCode
}
