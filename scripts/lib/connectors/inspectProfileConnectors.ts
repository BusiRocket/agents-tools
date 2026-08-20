import { applyCodexStdioProbes } from "./applyCodexStdioProbes"
import { probeStdioMcp } from "./probeStdioMcp"
import { runClaudeMcpList } from "./runClaudeMcpList"
import { runCodexMcpList } from "./runCodexMcpList"
import { readProfileConnectorStatus } from "./readProfileConnectorStatus"
import type { CodexStdioProbeTarget } from "./types/CodexStdioProbeTarget"
import type { ConnectorDefinition } from "./types/ConnectorDefinition"
import type { ConnectorProfile } from "./types/ConnectorProfile"

export const inspectProfileConnectors = async (
  profile: ConnectorProfile,
  definitions: ConnectorDefinition[],
  home: string,
  codexStdioTargets: ReadonlyMap<string, CodexStdioProbeTarget> = new Map(),
  listCodex: typeof runCodexMcpList = runCodexMcpList,
  probeStdio: typeof probeStdioMcp = probeStdioMcp,
): Promise<ReturnType<typeof readProfileConnectorStatus>> => {
  const output = profile === "codex" ? await listCodex() : await runClaudeMcpList(profile, home)
  const results = readProfileConnectorStatus(output, profile, definitions)
  return profile === "codex"
    ? applyCodexStdioProbes(results, codexStdioTargets, probeStdio)
    : results
}
