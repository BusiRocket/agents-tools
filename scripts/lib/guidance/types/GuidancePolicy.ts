export interface GuidancePolicy {
  version: 1
  requiredInvariants: string[]
  officialDocumentationOrigins: string[]
  maxOutputBytes: number
  agentCommand: string[]
  timeoutMs: number
}
