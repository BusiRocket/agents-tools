/**
 * Detect if umbrella rule should become a workflow or stay as a rule
 * @param {object} parsed - Parsed MDC with frontmatter and content
 * @param {string} _rulePath - Path to the rule file
 * @returns {object} - { isWorkflow: boolean, content: string }
 */
export function detectUmbrellaType(parsed, _rulePath) {
  const { content } = parsed

  // Check if content suggests sequential steps (workflow)
  const hasSequentialSteps = /(?:step|first|then|next|finally)/i.test(content)
  const hasNumberedList = /^\d+\./m.test(content)

  // If it's mostly references, keep as rule with @mentions
  const referenceCount = (content.match(/\.cursor\/rules\//g) || []).length
  const isMainlyReferences = referenceCount > 3

  return {
    isWorkflow: hasSequentialSteps && hasNumberedList && !isMainlyReferences,
    content,
  }
}
