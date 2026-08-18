import { runClaudeMcpList } from "./runClaudeMcpList"
import { readClaudeConnectorStatus } from "./readClaudeConnectorStatus"
import type { ConnectorDefinition } from "./types/ConnectorDefinition"

export const inspectProfileConnectors = async (
  profile: "claude-personal" | "claude-favish",
  definitions: ConnectorDefinition[],
  home: string,
) => readClaudeConnectorStatus(await runClaudeMcpList(profile, home), profile, definitions)
