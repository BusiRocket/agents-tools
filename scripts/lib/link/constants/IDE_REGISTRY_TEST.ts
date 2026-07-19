import assert from "node:assert/strict"
import test from "node:test"
import { IDE_REGISTRY } from "./IDE_REGISTRY"

void test("Codex reads the canonical user skills directory directly", () => {
  assert.equal(
    IDE_REGISTRY.some(({ id }) => id === "codex"),
    false,
  )
})
