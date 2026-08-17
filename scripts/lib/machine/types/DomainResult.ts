import type { MachineStatus } from "./MachineStatus"

export type DomainResult = {
  domain: string
  status: MachineStatus
  changes: number
  messages: string[]
}
