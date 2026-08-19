import { containsSensitiveGuidanceContent } from "../containsSensitiveGuidanceContent"
import { isAllowedDocumentationUrl } from "../isAllowedDocumentationUrl"
import { parseReconciliationResult } from "../parseReconciliationResult"
import type { GuidancePolicy } from "../types/GuidancePolicy"
import type { ReconciliationResult } from "../types/ReconciliationResult"

export const validateReconciliationResult = (
  raw: unknown,
  policy: GuidancePolicy,
  expectedInputHashes: Record<string, string>,
  runStartedAt = new Date(0),
): { ok: true; result: ReconciliationResult } | { ok: false; errors: string[] } => {
  const parsed = parseReconciliationResult(raw)
  if (!parsed.ok) return parsed
  const evidenceIsCurrent = (retrievedAt: string): boolean => {
    const timestamp = Date.parse(retrievedAt)
    return Number.isFinite(timestamp) && timestamp >= runStartedAt.getTime() - 60_000
  }
  const result = parsed.result
  const errors: string[] = []
  if (
    JSON.stringify(Object.keys(result.inputHashes).sort()) !==
      JSON.stringify(Object.keys(expectedInputHashes).sort()) ||
    Object.entries(expectedInputHashes).some(([key, value]) => result.inputHashes[key] !== value)
  )
    errors.push("input hashes do not match current sources")
  if (
    !result.documentation.some(
      (item) =>
        item.provider === "claude" &&
        isAllowedDocumentationUrl(item.url, policy.officialDocumentationOrigins.claude) &&
        evidenceIsCurrent(item.retrievedAt),
    )
  )
    errors.push("missing current official Claude documentation evidence")
  if (
    !result.documentation.some(
      (item) =>
        item.provider === "codex" &&
        isAllowedDocumentationUrl(item.url, policy.officialDocumentationOrigins.codex) &&
        evidenceIsCurrent(item.retrievedAt),
    )
  )
    errors.push("missing current official Codex documentation evidence")
  const documents = [
    result.shared,
    result.claudeOverlay,
    result.codexOverlay,
    result.claudeDocument,
    result.codexDocument,
  ]
  if (containsSensitiveGuidanceContent(JSON.stringify(result)))
    errors.push("result contains secret or captured conversation material")
  if (/@(?:[~./]|[A-Za-z0-9_-]+\.md|[A-Za-z0-9_-]+\/)/u.test(result.codexDocument))
    errors.push("Codex document contains an unresolved Claude import")
  for (const invariant of policy.requiredInvariants) {
    if (!result.claudeDocument.includes(invariant) || !result.codexDocument.includes(invariant))
      errors.push(`required invariant is missing from a rendered document: ${invariant}`)
  }
  if (documents.some((document) => Buffer.byteLength(document, "utf8") > policy.maxOutputBytes))
    errors.push("result exceeds configured output byte limit")
  return errors.length > 0 ? { ok: false, errors } : { ok: true, result }
}
