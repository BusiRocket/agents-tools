import { renderBundleMd } from "./renderBundleMd.mjs"

/**
 * Render bundle as CLAUDE.md format (single markdown with mdc blocks).
 *
 * @param {Array<{ rel: string, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered CLAUDE.md content
 */
export const renderClaude = (bundle) => renderBundleMd("CLAUDE.md", bundle)
