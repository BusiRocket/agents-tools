import { AGENTS_HEADER_INTRO } from "../constants/AGENTS_HEADER_INTRO"
import { AGENTS_MAX_CHARS } from "../constants/AGENTS_MAX_CHARS"
import { renderIndexOnly } from "./renderIndexOnly"

/**
 * Render bundle as AGENTS.md (index-only: references only, no rule bodies).
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered AGENTS.md content
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderAgents(bundle: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const atomicRule = bundle.find((item: any) => item.rel === "core/atomic-file-rule.mdc")
  return renderIndexOnly(bundle, {
    format: "claude",
    title: "# AGENTS.md",
    headerIntro: AGENTS_HEADER_INTRO,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    embedContent: atomicRule?.content,
    maxChars: AGENTS_MAX_CHARS,
    includeShortSummary: true,
    referencePrefix: "@rules/",
    onLimit: "error",
  })
}
