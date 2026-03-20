import type { RuleItem } from "../types/RuleItem"
import { CLAUDE_HEADER_INTRO } from "../constants/CLAUDE_HEADER_INTRO"
import { renderIndexOnly } from "./renderIndexOnly"

/**
 * Index-only bootstrap renderer for CLAUDE.md.
 * Thin wrapper around renderIndexOnly with CLAUDE-specific header and options.
 *
 * @param {Array<{ rel: string, frontmatter: unknown, content: string }>} bundle
 * @param {{ maxChars?: number, includeShortSummary?: boolean }=} options
 * @returns {string}
 */

interface RenderClaudeOptions {
  maxChars?: number
  includeShortSummary?: boolean
}

export function renderClaudeIndexOnly(bundle: RuleItem[], options: RenderClaudeOptions = {}) {
  const maxChars = typeof options.maxChars === "number" ? options.maxChars : 15_000

  const atomicRule = bundle.find((item) => item.rel === "core/atomic-file-rule.mdc")
  return renderIndexOnly(bundle, {
    format: "claude",
    title: "# CLAUDE.md",
    headerIntro: CLAUDE_HEADER_INTRO,

    ...(atomicRule?.content ? { embedContent: atomicRule.content } : {}),

    maxChars,

    includeShortSummary: options.includeShortSummary === true,
    referencePrefix: "@rules/",
    onLimit: "error",
  })
}
