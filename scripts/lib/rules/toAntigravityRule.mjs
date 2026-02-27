/**
 * Convert MDC frontmatter to Antigravity (Google Gemini) rule format
 *
 * Antigravity Rules:
 * - Located in: .agent/rules/
 * - Global rules: ~/.gemini/GEMINI.md
 * - Max 12,000 characters per file
 * - Activation modes: Manual, Always On, Model Decision, Glob
 * - Supports @mentions for file references
 */

import { getAntigravityActivation } from "./antigravity/getAntigravityActivation.mjs"
import { convertToAntigravityMentions } from "./antigravity/convertToAntigravityMentions.mjs"
import { splitForAntigravity } from "./antigravity/splitForAntigravity.mjs"
import { detectUmbrellaType } from "./antigravity/detectUmbrellaType.mjs"
import { generateAntigravityHeader } from "./antigravity/generateAntigravityHeader.mjs"

/**
 * Main conversion function
 * @param {object} parsed - Parsed MDC with frontmatter and content
 * @param {string} rulePath - Original rule path
 * @returns {Array<{name: string, content: string, isWorkflow: boolean}>}
 */
export function toAntigravityRule(parsed, rulePath) {
  const activation = getAntigravityActivation(parsed.frontmatter)
  const header = generateAntigravityHeader(parsed.frontmatter, activation)

  // Convert references
  let content = convertToAntigravityMentions(parsed.content, rulePath)

  // Check if umbrella type
  const umbrellaInfo = detectUmbrellaType(parsed, rulePath)

  // Full content with header
  const fullContent = header + content

  // Get rule name from path
  const ruleName = rulePath.replace(/\.mdc$/, "").replace(/\//g, "-")

  // Split if necessary
  const parts = splitForAntigravity(fullContent, ruleName)

  return parts.map((part) => ({
    ...part,
    isWorkflow: umbrellaInfo.isWorkflow,
  }))
}
