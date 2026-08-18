import type { PlatformCapability } from "./PlatformCapability"
import type { CapabilityStatus } from "./CapabilityStatus"

export interface CapabilityHealth {
  capability: PlatformCapability
  status: CapabilityStatus
  summary: string
  findings: string[]
}
