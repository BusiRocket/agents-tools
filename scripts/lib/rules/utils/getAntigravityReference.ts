import { detectUmbrellaType } from "../antigravity/utils/detectUmbrellaType"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAntigravityReference(item: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const ruleName = item.rel.replace(/\.mdc$/, "").replace(/\//g, "-")
  const { isWorkflow } = detectUmbrellaType(
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      frontmatter: item.frontmatter,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      content: item.content,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    item.rel,
  )
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return isWorkflow ? `@.agent/workflows/${ruleName}.md` : `@.agent/rules/${ruleName}.md`
}
