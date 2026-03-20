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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toAntigravityRule(parsed: any, rulePath: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const activation = getAntigravityActivation(parsed.frontmatter)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const header = generateAntigravityHeader(parsed.frontmatter, activation)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const content = convertToAntigravityMentions(parsed.content, rulePath)
  const umbrellaInfo = detectUmbrellaType(parsed, rulePath)
  const fullContent = header + content
  const ruleName = rulePath.replace(/\.mdc$/, "").replace(/\//g, "-")
  const parts = splitForAntigravity(fullContent, ruleName)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return parts.map((part: any) => ({
    ...part,
    isWorkflow: umbrellaInfo.isWorkflow,
  }))
}
