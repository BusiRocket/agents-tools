import type { DocumentationEvidence } from "./DocumentationEvidence"
import type { GuidanceDecision } from "./GuidanceDecision"

export interface ReconciliationResult {
  version: 1
  inputHashes: Record<string, string>
  shared: string
  claudeOverlay: string
  codexOverlay: string
  claudeDocument: string
  codexDocument: string
  documentation: DocumentationEvidence[]
  decisions: GuidanceDecision[]
  warnings: string[]
  unresolvedLimitations: string[]
}
