import { runClaudeMcpList } from "./runClaudeMcpList"
import { runCodexMcpList } from "./runCodexMcpList"
import { readProfileConnectorStatus } from "./readProfileConnectorStatus"
import type { ConnectorDefinition } from "./types/ConnectorDefinition"
import type { ConnectorProfile } from "./types/ConnectorProfile"

export const inspectProfileConnectors = async (
  profile: ConnectorProfile,
  definitions: ConnectorDefinition[],
  home: string,
): Promise<ReturnType<typeof readProfileConnectorStatus>> => {
  const output =
    profile === "codex" ? await runCodexMcpList() : await runClaudeMcpList(profile, home)
  return readProfileConnectorStatus(output, profile, definitions)
}
