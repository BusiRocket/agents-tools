import { renderIndexOnly } from "./renderIndexOnly.mjs"

const WINDSURF_HEADER_INTRO = [
  "## Index-only (Windsurf/Cascade)",
  "",
  "This file lists rule references only. Content is not inlined.",
  "Use `@rules/<path>.mdc` to load full rule content.",
  "If your IDE does not resolve @rules/... references, ensure rules are synced to your IDE config.",
].join("\n")

const WINDSURF_MAX_CHARS = 50_000

/**
 * @param {{ frontmatter: object }} item
 * @returns {string}
 */
function getPriority(item) {
  const { frontmatter } = item
  if (frontmatter.alwaysApply === true) return "high"
  if (frontmatter.globs && frontmatter.globs.trim() !== "") return "high"
  return "medium"
}

/**
 * Render bundle as WINDSURF.md (index-only with optional priority badges).
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered WINDSURF.md content
 */
export function renderWindsurf(bundle) {
  const atomicRule = bundle.find((item) => item.rel === "core/atomic-file-rule.mdc")
  return renderIndexOnly(bundle, {
    format: "claude",
    title: "# WINDSURF.md",
    headerIntro: WINDSURF_HEADER_INTRO,
    embedContent: atomicRule?.content,
    maxChars: WINDSURF_MAX_CHARS,
    includeShortSummary: true,
    referencePrefix: "@rules/",
    onLimit: "error",
    getRuleBadges: (item) => [`Priority: ${getPriority(item)}`],
  })
}
