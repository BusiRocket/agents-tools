import assert from "node:assert/strict"
import test from "node:test"
import { seedRuleEntries } from "./seedRuleEntries"

void test("a rule is namespaced so it cannot collide with a skill of the same name", () => {
  const entries = seedRuleEntries(["core/git-workflow.mdc"], "agents-tools")
  assert.ok(entries["rules/core/git-workflow.mdc"])
})

void test("rules authored here are adopted with their source recorded", () => {
  const entry = seedRuleEntries(["api.mdc"], "agents-tools")["rules/api.mdc"]
  assert.ok(entry)
  assert.equal(entry.state, "adopted")
  assert.equal(entry.source, "agents-tools")
})

void test("an empty rule set produces no entries", () => {
  assert.deepEqual(seedRuleEntries([], "agents-tools"), {})
})

void test("the seeded rules satisfy the manifest parser", async () => {
  const { parseCurationManifest } = await import("./parseCurationManifest")
  const manifest = { version: 1, entries: seedRuleEntries(["core/general.mdc"], "agents-tools") }
  assert.ok(parseCurationManifest(manifest).ok)
})
