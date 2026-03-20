import type { RuleItem } from "../types/RuleItem"
import { convertToAntigravityMentions } from "../antigravity/utils/convertToAntigravityMentions"
import { detectUmbrellaType } from "../antigravity/utils/detectUmbrellaType"
import { generateAntigravityHeader } from "../antigravity/utils/generateAntigravityHeader"
import { getAntigravityActivation } from "../antigravity/utils/getAntigravityActivation"
import { splitForAntigravity } from "../antigravity/utils/splitForAntigravity"

/**
 * Main conversion function
 * @param {object} parsed - Parsed MDC with frontmatter and content
 * @param {string} rulePath - Original rule path
 * @returns {Array<{name: string, content: string, isWorkflow: boolean}>}
 */

export function toAntigravityRule(parsed: RuleItem, rulePath: string) {
  const activation = getAntigravityActivation(parsed.frontmatter)

  const header = generateAntigravityHeader(parsed.frontmatter, activation)

  const content = convertToAntigravityMentions(parsed.content ?? "", rulePath)
  const umbrellaInfo = detectUmbrellaType(parsed, rulePath)
  const fullContent = header + content
  const ruleName = rulePath.replace(/\.mdc$/, "").replace(/\//g, "-")
  const parts = splitForAntigravity(fullContent, ruleName)

  return parts.map((part) => ({
    ...part,
    isWorkflow: umbrellaInfo.isWorkflow,
  }))
}
