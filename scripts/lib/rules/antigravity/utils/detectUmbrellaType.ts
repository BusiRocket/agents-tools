/**
 * Detect if umbrella rule should become a workflow or stay as a rule
 * @param {object} parsed - Parsed MDC with frontmatter and content
 * @param {string} _rulePath - Path to the rule file
 * @returns {object} - { isWorkflow: boolean, content: string }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function detectUmbrellaType(parsed: any, _rulePath: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { content } = parsed
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const hasSequentialSteps = /(?:step|first|then|next|finally)/i.test(content)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const hasNumberedList = /^\d+\./m.test(content)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
  const referenceCount = (content.match(/\.cursor\/rules\//g) || []).length
  const isMainlyReferences = referenceCount > 3
  return {
    isWorkflow: hasSequentialSteps && hasNumberedList && !isMainlyReferences,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    content,
  }
}
