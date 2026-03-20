import { DEFAULT_MAX_CHARS } from "../constants/DEFAULT_MAX_CHARS"
import { DEFAULT_MIN_REFS } from "../constants/DEFAULT_MIN_REFS"

/**
 * DoD checks on index-only output string.
 * @param {string} output
 * @param {{ maxChars?: number, minRefs?: number, refPattern?: RegExp, refLabel?: string }} options
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function verifyIndexOnlyOutput(
  output: string,
  options: { maxChars?: number; minRefs?: number; refPattern?: RegExp; refLabel?: string } = {},
) {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS
  const minRefs = options.minRefs ?? DEFAULT_MIN_REFS
  const refPattern = options.refPattern ?? /@rules\/[^\s`]+/g
  const refLabel = options.refLabel ?? "@rules/"
  const errors = []
  if (typeof output !== "string") {
    return { ok: false, errors: ["Output is not a string"] }
  }

  if (output.includes("```mdc")) {
    errors.push('Output must not contain inline mdc blocks (no "```mdc")')
  }

  if (!output.includes("## Rules index (router)")) {
    errors.push('Output must include "## Rules index (router)"')
  }

  const refMatches = output.match(refPattern)
  const refs = refMatches ? [...new Set(refMatches)] : []
  if (refs.length < minRefs) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    errors.push(`Expected at least ${minRefs} ${refLabel} references, got ${refs.length}`)
  }

  const duplicates = refMatches && refMatches.length !== refs.length
  if (duplicates) {
    errors.push(`Duplicate ${refLabel} references found`)
  }

  if (output.length > maxChars) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    errors.push(`Output length ${output.length} exceeds maxChars ${maxChars}`)
  }

  return { ok: errors.length === 0, errors }
}
