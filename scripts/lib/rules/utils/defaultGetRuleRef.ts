import type { RuleItem } from "../types/RuleItem"
import { normalizeRel } from "./normalizeRel"

export function defaultGetRuleRef(prefix: string) {
  return (rule: RuleItem) => `${prefix}${normalizeRel(rule.rel)}`
}
