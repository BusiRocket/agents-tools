import { GEMINI_HEADER_INTRO } from "../constants/GEMINI_HEADER_INTRO"
import { GEMINI_MAX_CHARS } from "../constants/GEMINI_MAX_CHARS"
import { getActivation } from "./getActivation"
import { getAntigravityReference } from "./getAntigravityReference"
import { renderIndexOnly } from "./renderIndexOnly"

/**
 * Render bundle as GEMINI.md (index-only with optional activation badges).
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered GEMINI.md content
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderAntigravity(bundle: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const atomicRule = bundle.find((item: any) => item.rel === "core/atomic-file-rule.mdc")
  return renderIndexOnly(bundle, {
    format: "claude",
    title: "# GEMINI.md",
    headerIntro: GEMINI_HEADER_INTRO,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    embedContent: atomicRule?.content,
    maxChars: GEMINI_MAX_CHARS,
    includeShortSummary: true,
    getRuleRef: getAntigravityReference,
    onLimit: "error",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRuleBadges: (item: any) => [getActivation(item)],
  })
}
