import type { SecretReference } from "../../secrets/SecretReference"

export const MCP_TARGETS = ["claude-personal", "claude-favish", "codex", "gemini"] as const

export type McpTarget = (typeof MCP_TARGETS)[number]

export type McpValue = string | SecretReference

export type McpOverride = {
  args_append?: string[]
}

export type McpServer = {
  targets: McpTarget[]
  transport: "stdio" | "http" | "sse"
  command?: string
  args?: McpValue[]
  url?: string
  env?: Record<string, McpValue>
  headers?: Record<string, McpValue>
  disabled?: boolean
  target_overrides?: Partial<Record<McpTarget, McpOverride>>
}

export type McpManifest = {
  servers: Record<string, McpServer>
}
