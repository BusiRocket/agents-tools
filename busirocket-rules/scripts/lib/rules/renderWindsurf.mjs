import { renderBundleWithMdcFrontmatter } from "./renderBundleWithMdcFrontmatter.mjs"

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
 * Render bundle as WINDSURF.md (Windsurf/Cascade) with per-rule frontmatter and priority.
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered WINDSURF.md content
 */
export function renderWindsurf(bundle) {
  return renderBundleWithMdcFrontmatter("WINDSURF.md", "(Windsurf/Cascade)", bundle, (item) => ({
    priority: getPriority(item),
  }))
}
