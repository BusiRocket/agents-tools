import assert from "node:assert/strict"
import test from "node:test"
import { resolveInstanceDir } from "./resolveInstanceDir"

void test("the explicit flag wins over everything", () => {
  const dir = resolveInstanceDir({
    flag: "/tmp/explicit",
    env: { AGENTS_MACHINE_DIR: "/tmp/from-env" },
    home: "/home/someone",
  })
  assert.equal(dir, "/tmp/explicit")
})

void test("the environment variable is used when no flag is given", () => {
  const dir = resolveInstanceDir({
    env: { AGENTS_MACHINE_DIR: "/tmp/from-env" },
    home: "/home/someone",
  })
  assert.equal(dir, "/tmp/from-env")
})

void test("it falls back to the dotfiles machine directory under home", () => {
  const dir = resolveInstanceDir({ env: {}, home: "/home/someone" })
  assert.equal(dir, "/home/someone/p/dotfiles/machine")
})

void test("an empty environment variable is treated as absent", () => {
  const dir = resolveInstanceDir({ env: { AGENTS_MACHINE_DIR: "" }, home: "/home/someone" })
  assert.equal(dir, "/home/someone/p/dotfiles/machine")
})
