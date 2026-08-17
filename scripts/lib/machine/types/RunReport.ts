import type { DomainResult } from "./DomainResult"

export type RunReport = {
  runId: string
  profile: string
  domains: DomainResult[]
  ok: boolean
}
