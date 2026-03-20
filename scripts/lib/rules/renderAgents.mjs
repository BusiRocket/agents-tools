import { renderIndexOnly } from "./renderIndexOnly.mjs"

const AGENTS_HEADER_INTRO = [
  "## Index-only",
  "",
  "This file lists rule references only. Content is not inlined.",
  "Use `@rules/<path>.mdc` to load full rule content.",
  "If your IDE does not resolve @rules/... references, ensure rules are synced to your IDE config.",
].join("\n")

const AGENTS_MAX_CHARS = 50_000

/**
 * Render bundle as AGENTS.md (index-only: references only, no rule bodies).
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered AGENTS.md content
 */
export function renderAgents(bundle) {
  const atomicRule = bundle.find((item) => item.rel === "core/atomic-file-rule.mdc")
  return renderIndexOnly(bundle, {
    format: "claude",
    title: "# AGENTS.md",
    headerIntro: AGENTS_HEADER_INTRO,
    embedContent: atomicRule?.content,
    maxChars: AGENTS_MAX_CHARS,
    includeShortSummary: true,
    referencePrefix: "@rules/",
    onLimit: "error",
  })
}
