import { renderClaudeServers } from "../../renderers/claude/renderClaudeServers"
import { desiredCodexServers } from "./desiredCodexServers"
import { MCP_TARGETS } from "./McpManifest"
import { normalizeCodexServer } from "./normalizeCodexServer"
import type { McpChange } from "./McpChange"
import type { McpManifest, McpTarget } from "./McpManifest"
import type { McpState } from "./read"

type PlanInput = {
  manifest: McpManifest
  state: McpState
  owned: Record<McpTarget, string[]>
  env: NodeJS.ProcessEnv
}

const sameShape = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right)

export const plan = ({ manifest, state, owned, env }: PlanInput) => {
  const changes: McpChange[] = []

  for (const target of MCP_TARGETS) {
    const isCodex = target === "codex"
    const desired: Record<string, unknown> = isCodex
      ? desiredCodexServers(manifest, env)
      : renderClaudeServers(manifest, target, env).servers

    const rawActual = state.byTarget[target]
    const actual: Record<string, unknown> = isCodex
      ? Object.fromEntries(
          Object.entries(rawActual).map(([name, record]) => [
            name,
            normalizeCodexServer(record as Record<string, string>),
          ]),
        )
      : rawActual

    const ownedHere = owned[target]

    for (const [name, value] of Object.entries(desired)) {
      const existing = actual[name]

      if (existing === undefined) {
        changes.push({ target, name, operation: "add" })
        continue
      }

      if (!sameShape(existing, value)) {
        changes.push({ target, name, operation: "update" })
      }
    }

    for (const name of Object.keys(actual)) {
      if (name in desired) {
        continue
      }

      if (ownedHere.includes(name)) {
        changes.push({ target, name, operation: "remove" })
      }
    }
  }

  return changes
}
