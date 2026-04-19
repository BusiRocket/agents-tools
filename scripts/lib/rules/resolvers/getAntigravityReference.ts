import type { RuleItem } from "../types/RuleItem"
import { detectUmbrellaType } from "../antigravity/transformers/detectUmbrellaType"

export function getAntigravityReference(item: RuleItem) {
  const ruleName = item.rel.replace(/\.mdc$/, "").replace(/\//g, "-")
  const { isWorkflow } = detectUmbrellaType(item, item.rel)

  return isWorkflow ? `@.agent/workflows/${ruleName}.md` : `@.agent/rules/${ruleName}.md`
}
