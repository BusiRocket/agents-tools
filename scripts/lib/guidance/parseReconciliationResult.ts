import { isRecord } from "./isRecord"
import type { ReconciliationResult } from "./types/ReconciliationResult"

export const parseReconciliationResult = (
  raw: unknown,
): { ok: true; result: ReconciliationResult } | { ok: false; errors: string[] } => {
  if (!isRecord(raw)) return { ok: false, errors: ["result must be an object"] }
  const keys = new Set([
    "version",
    "inputHashes",
    "shared",
    "claudeOverlay",
    "codexOverlay",
    "claudeDocument",
    "codexDocument",
    "documentation",
    "decisions",
    "warnings",
    "unresolvedLimitations",
  ])
  const isStringRecord = (value: unknown): value is Record<string, string> =>
    isRecord(value) &&
    Object.values(value).every((item) => typeof item === "string" && /^[a-f0-9]{64}$/u.test(item))
  const isEvidence = (value: unknown): boolean =>
    isRecord(value) &&
    (value.provider === "claude" || value.provider === "codex") &&
    typeof value.url === "string" &&
    typeof value.retrievedAt === "string" &&
    !Number.isNaN(Date.parse(value.retrievedAt))
  const isDecision = (value: unknown): boolean =>
    isRecord(value) &&
    ["promoted", "preserved", "translated", "removed"].includes(String(value.action)) &&
    ["shared", "claude", "codex", "rule"].includes(String(value.source)) &&
    typeof value.rationale === "string" &&
    value.rationale.trim() !== ""
  const errors: string[] = []
  for (const key of Object.keys(raw)) if (!keys.has(key)) errors.push(`unknown property: ${key}`)
  if (raw.version !== 1) errors.push("version must be 1")
  if (!isStringRecord(raw.inputHashes)) errors.push("inputHashes must map strings to strings")
  for (const key of [
    "shared",
    "claudeOverlay",
    "codexOverlay",
    "claudeDocument",
    "codexDocument",
  ] as const)
    if (typeof raw[key] !== "string" || raw[key].trim() === "")
      errors.push(`${key} must be non-empty text`)
  if (
    !Array.isArray(raw.documentation) ||
    raw.documentation.length === 0 ||
    !raw.documentation.every(isEvidence)
  )
    errors.push("documentation entries are invalid")
  if (!Array.isArray(raw.decisions) || !raw.decisions.every(isDecision))
    errors.push("decisions are invalid")
  for (const key of ["warnings", "unresolvedLimitations"] as const)
    if (!Array.isArray(raw[key]) || !raw[key].every((item) => typeof item === "string"))
      errors.push(`${key} must be a string array`)
  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, result: raw as unknown as ReconciliationResult }
}
