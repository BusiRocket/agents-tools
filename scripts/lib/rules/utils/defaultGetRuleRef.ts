import { normalizeRel } from "./normalizeRel"

export function defaultGetRuleRef(prefix: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  return (rule: any) => `${prefix}${normalizeRel(rule.rel)}`
}
