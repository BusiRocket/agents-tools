import { connectorExitCode } from "./connectorExitCode"
import { resolveConnectorProfiles } from "./resolveConnectorProfiles"
import type { ConnectorDoctorInput } from "./types/ConnectorDoctorInput"
import type { ConnectorDoctorResult } from "./types/ConnectorDoctorResult"

export const runConnectorDoctor = async (
  input: ConnectorDoctorInput,
): Promise<ConnectorDoctorResult> => {
  const { parsed } = input
  if (!parsed.ok) {
    return { exitCode: 2, output: { ok: false, errors: parsed.errors } }
  }
  const results = (
    await Promise.all(
      resolveConnectorProfiles(input.requestedProfile).map((profile) =>
        input.inspect(profile, parsed.manifest.connectors, input.home),
      ),
    )
  ).flat()
  const exitCode = connectorExitCode(results)
  return { exitCode, output: { ok: exitCode === 0, connectors: results } }
}
