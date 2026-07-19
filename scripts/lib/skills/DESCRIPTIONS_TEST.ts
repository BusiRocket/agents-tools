import assert from "node:assert/strict"
import test from "node:test"
import { descriptionBoundaryErrors } from "../../validators/descriptionBoundaryErrors"
import { frontmatterDescriptionErrors } from "../../validators/frontmatterDescriptionErrors"
import { collectSkillFrontmatter } from "./collectSkillFrontmatter"
import { extractDescription } from "./extractDescription"

/**
 * Runs the description validators that existed in this repo but had no callers,
 * so a skill whose description cannot be parsed or has no activation boundary
 * fails the build instead of shipping silently.
 */

void test("every skill description parses", () => {
  const failures = collectSkillFrontmatter().flatMap(({ name, frontmatter }) =>
    frontmatterDescriptionErrors(frontmatter).map((error) => `${name}: ${error}`),
  )
  assert.deepEqual(failures, [], failures.join("\n"))
})

void test("every skill description has activation boundaries", () => {
  const failures = collectSkillFrontmatter().flatMap(({ name, frontmatter }) =>
    descriptionBoundaryErrors(extractDescription(frontmatter)).map((error) => `${name}: ${error}`),
  )
  assert.deepEqual(failures, [], failures.join("\n"))
})
