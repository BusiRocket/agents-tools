import type { LiveProbeDefinition } from "../types/LiveProbeDefinition"

export const createLiveProbeDefinition = (command: string): LiveProbeDefinition => ({
  platformId: "test",
  capability: "mcp",
  command,
  args: [],
  timeoutMs: 1_000,
})
