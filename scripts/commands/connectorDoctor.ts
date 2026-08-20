import { homedir } from "node:os"
import { ROOT } from "../constants/ROOT"
import { inspectProfileConnectors } from "../lib/connectors/inspectProfileConnectors"
import { loadConnectorManifest } from "../lib/connectors/loadConnectorManifest"
import { runConnectorDoctor } from "../lib/connectors/runConnectorDoctor"
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
  const requested = flagValue(process.argv, "--profile")
  const result = await runConnectorDoctor({
    parsed,
    requestedProfile: requested,
    home: homedir(),
    inspect: inspectProfileConnectors,
  })
  console.log(JSON.stringify(result.output, null, 2))
  process.exitCode = result.exitCode
}
