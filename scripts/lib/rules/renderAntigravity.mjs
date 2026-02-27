import { renderBundleWithMdcFrontmatter } from "./renderBundleWithMdcFrontmatter.mjs"

/**
 * @param {{ frontmatter: object }} item
 * @returns {string}
 */
function getActivation(item) {
  const { frontmatter } = item
  if (frontmatter.alwaysApply === true) return "Always On"
  if (frontmatter.globs && frontmatter.globs.trim() !== "") return `Glob: ${frontmatter.globs}`
  return "Model Decision"
}

/**
 * Render bundle as GEMINI.md (Antigravity) with per-rule frontmatter and activation.
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered GEMINI.md content
 */
export function renderAntigravity(bundle) {
  return renderBundleWithMdcFrontmatter("GEMINI.md", "", bundle, (item) => ({
    activation: getActivation(item),
  }))
}
