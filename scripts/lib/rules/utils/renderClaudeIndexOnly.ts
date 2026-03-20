import { CLAUDE_HEADER_INTRO } from "../constants/CLAUDE_HEADER_INTRO"
import { renderIndexOnly } from "./renderIndexOnly"

/**
 * Index-only bootstrap renderer for CLAUDE.md.
 * Thin wrapper around renderIndexOnly with CLAUDE-specific header and options.
 *
 * @param {Array<{ rel: string, frontmatter: any, content: string }>} bundle
 * @param {{ maxChars?: number, includeShortSummary?: boolean }=} options
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderClaudeIndexOnly(bundle: any[], options: any = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const maxChars = typeof options.maxChars === "number" ? options.maxChars : 15_000
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const atomicRule = bundle.find((item: any) => item.rel === "core/atomic-file-rule.mdc")
  return renderIndexOnly(bundle, {
    format: "claude",
    title: "# CLAUDE.md",
    headerIntro: CLAUDE_HEADER_INTRO,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    embedContent: atomicRule?.content,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    maxChars,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    includeShortSummary: options.includeShortSummary === true,
    referencePrefix: "@rules/",
    onLimit: "error",
  })
}
