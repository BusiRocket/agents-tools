import { readClaudeServers } from "./readClaudeServers"
import { readCodexServers } from "./readCodexServers"
import type { McpTarget } from "./McpManifest"

export type McpState = {
  byTarget: Record<McpTarget, Record<string, unknown>>
}

export const read = async (paths: Record<McpTarget, string>): Promise<McpState> => ({
  byTarget: {
    "claude-personal": await readClaudeServers(paths["claude-personal"]),
    "claude-favish": await readClaudeServers(paths["claude-favish"]),
    codex: await readCodexServers(paths.codex),
    gemini: await readClaudeServers(paths.gemini),
  },
})
