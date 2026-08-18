export interface ConnectorDefinition {
  id: string
  match: string
  profiles: ("claude-personal" | "claude-favish" | "codex")[]
  ownership: "machine" | "account"
  probe: "native-cli" | "claude-cli-prefix" | "http-mcp"
  criticality: "required" | "optional"
  endpoint?: string
}
