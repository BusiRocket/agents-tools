import type { ConnectorDefinition } from "./ConnectorDefinition"
import type { ConnectorManifestParseResult } from "./ConnectorManifestParseResult"
import type { ConnectorProfile } from "./ConnectorProfile"
import type { ProfileConnectorResult } from "./ProfileConnectorResult"

export interface ConnectorDoctorInput {
  parsed: ConnectorManifestParseResult
  requestedProfile: string | undefined
  home: string
  inspect: (
    profile: ConnectorProfile,
    definitions: ConnectorDefinition[],
    home: string,
  ) => Promise<ProfileConnectorResult[]>
}
