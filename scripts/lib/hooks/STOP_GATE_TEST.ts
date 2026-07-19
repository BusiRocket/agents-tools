import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { runStopGate } from "./runStopGate"

/**
 * The gate has one loud behaviour and several silent ones. Testing only the
 * block would let it regress into blocking everything, or into never firing -
 * the failure that let "it's done" claims through on non-Node projects.
 */

const project = (files: Record<string, string>, edited = true): string => {
  const dir = mkdtempSync(path.join(tmpdir(), "stopgate-"))
  for (const [name, body] of Object.entries(files)) writeFileSync(path.join(dir, name), body)
  writeFileSync(path.join(dir, "transcript.jsonl"), edited ? '{"name":"Edit"}' : '{"name":"Read"}')
  return dir
}

void test("blocks when a failing check exists", () => {
  for (const [label, files] of [
    ["package.json", { "package.json": '{"scripts":{"check":"exit 1"}}' }],
    ["composer.json", { "composer.json": '{"scripts":{"check":"exit 1"}}' }],
    ["Makefile", { Makefile: "check:\n\t@exit 1\n" }],
  ] as [string, Record<string, string>][]) {
    const reason = runStopGate(project(files), true)
    assert.notEqual(reason, null, `${label}: expected a block`)
    assert.match(String(reason), /Verification gate FAILED/, label)
  }
})

void test("stays silent when the check passes", () => {
  assert.equal(
    runStopGate(project({ "package.json": '{"scripts":{"check":"exit 0"}}' }), true),
    null,
  )
  assert.equal(runStopGate(project({ Makefile: "check:\n\t@exit 0\n" }), true), null)
})

void test("stays silent when the project defines no check target", () => {
  assert.equal(runStopGate(project({ "package.json": "{}" }), true), null)
  assert.equal(runStopGate(project({ "README.md": "hi" }), true), null)
})

void test("stays silent when nothing was edited this session", () => {
  assert.equal(
    runStopGate(project({ "package.json": '{"scripts":{"check":"exit 1"}}' }, false), false),
    null,
  )
})
