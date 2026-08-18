import assert from "node:assert/strict"
import test from "node:test"
import { renderAntigravity } from "./renderAntigravity"
import type { RuleItem } from "../types/RuleItem"

void test("Gemini output contains only valid file imports", () => {
  const bundle: RuleItem[] = [
    {
      rel: "core/example.mdc",
      frontmatter: { description: "Use @refactor and contact person@example.com" },
      content: "Example rule",
    },
  ]

  const rendered = renderAntigravity(bundle)
  assert.match(rendered, /@\.agent\/rules\/core-example\.md/)
  assert.equal(rendered.includes("@refactor"), false)
  assert.match(rendered, /person@example\.com/)
})
