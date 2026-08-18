import type { ConnectorStatus } from "./ConnectorStatus"

export interface ProfileConnectorResult {
  id: string
  profile: "claude-personal" | "claude-favish" | "codex"
  status: ConnectorStatus
  criticality: "required" | "optional"
  boundary: "client" | "hosted-connector" | "access-gateway"
  summary: string
}
