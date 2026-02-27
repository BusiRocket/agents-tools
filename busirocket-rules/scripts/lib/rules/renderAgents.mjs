import { renderBundleMd } from "./renderBundleMd.mjs"

/**
 * Render bundle as AGENTS.md format (single markdown with mdc blocks).
 *
 * @param {Array<{ rel: string, content: string }>} bundle - From generateBundle
 * @returns {string} - Rendered AGENTS.md content
 */
export const renderAgents = (bundle) => renderBundleMd("AGENTS.md", bundle)
