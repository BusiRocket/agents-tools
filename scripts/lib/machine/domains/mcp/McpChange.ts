import type { McpTarget } from "./McpManifest"

export type McpChange = {
  target: McpTarget
  name: string
  operation: "add" | "update" | "remove"
}
