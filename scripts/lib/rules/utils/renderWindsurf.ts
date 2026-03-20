import { getPriority } from "./getPriority"
import { WINDSURF_HEADER_INTRO } from "../constants/WINDSURF_HEADER_INTRO"
import { WINDSURF_MAX_CHARS } from "../constants/WINDSURF_MAX_CHARS"
import { renderIndexOnly } from "./renderIndexOnly"

/**
 * Render bundle as WINDSURF.md (index-only with optional priority badges).
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered WINDSURF.md content
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderWindsurf(bundle: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const atomicRule = bundle.find((item: any) => item.rel === "core/atomic-file-rule.mdc")
  return renderIndexOnly(bundle, {
    format: "claude",
    title: "# WINDSURF.md",
    headerIntro: WINDSURF_HEADER_INTRO,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    embedContent: atomicRule?.content,
    maxChars: WINDSURF_MAX_CHARS,
    includeShortSummary: true,
    referencePrefix: "@rules/",
    onLimit: "error",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRuleBadges: (item: any) => [`Priority: ${getPriority(item)}`],
  })
}
