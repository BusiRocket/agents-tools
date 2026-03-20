import type { groupByCategoryAndSubcategory } from "./groupByCategoryAndSubcategory"

export function renderGrouped(grouped: ReturnType<typeof groupByCategoryAndSubcategory>): string {
  const lines: string[] = []
  for (const { category, subgroups } of grouped) {
    lines.push(`## ${category}`)
    lines.push("")

    for (const { subcategory, rules } of subgroups) {
      if (subcategory) {
        lines.push(`### ${subcategory}`)
        lines.push("")
      }

      for (const rule of rules) {
        lines.push(`#### ${rule.rel}`)
        lines.push("")
        lines.push("```mdc")
        // Keep rule content verbatim; do not trim.

        lines.push(rule.content)
        // Ensure a newline before closing fence even if content doesn't end with one.

        if (!rule.content.endsWith("\n")) lines.push("")
        lines.push("```")
        lines.push("")
      }
    }
  }

  return lines.join("\n")
}
