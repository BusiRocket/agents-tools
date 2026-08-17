import { renderClaudeServers } from "../../renderers/claude/renderClaudeServers"
import { actualServersFor } from "./actualServersFor"
import { MCP_TARGETS } from "./constants/MCP_TARGETS"
import { desiredCodexServers } from "./desiredCodexServers"
import { planTarget } from "./planTarget"
import type { McpChange } from "./types/McpChange"
import type { PlanInput } from "./types/PlanInput"

export const plan = ({ manifest, state, owned, env }: PlanInput) => {
  const changes: McpChange[] = []

  for (const target of MCP_TARGETS) {
    const desired: Record<string, unknown> =
      target === "codex"
        ? desiredCodexServers(manifest, env)
        : renderClaudeServers(manifest, target, env).servers

    changes.push(...planTarget(target, desired, actualServersFor(state, target), owned[target]))
  }

  return changes
}
