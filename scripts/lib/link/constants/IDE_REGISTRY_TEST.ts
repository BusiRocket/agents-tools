import assert from "node:assert/strict"
import test from "node:test"
import { IDE_REGISTRY } from "./IDE_REGISTRY"

void test("Codex is registered for rule linking but has no skills target", () => {
  const codex = IDE_REGISTRY.find(({ id }) => id === "codex")
  assert.ok(codex, 'codex must stay registered so findIde("codex") resolves for rules:link')
  assert.equal(codex.skillsDir, undefined)
  assert.equal(codex.linkStrategy, undefined)
})

void test("Gemini CLI uses canonical user skills without a duplicate target", () => {
  const gemini = IDE_REGISTRY.find(({ id }) => id === "gemini-cli")
  assert.ok(gemini, "gemini-cli must stay registered for platform detection")
  assert.equal(gemini.skillsDir, undefined)
  assert.equal(gemini.linkStrategy, undefined)
})
