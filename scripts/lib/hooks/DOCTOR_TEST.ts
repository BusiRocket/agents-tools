import assert from "node:assert/strict"
import test from "node:test"
import { findUnreachableHooks } from "./findUnreachableHooks"

/**
 * Guards the failure mode that hid a dead hook in this repo: a hook file that is
 * correct, tested, and wired into hooks.json, but that nothing live ever invokes.
 */

void test("every declared hook is reachable from a live config", () => {
  const unreachable = findUnreachableHooks()
  assert.deepEqual(
    unreachable,
    [],
    `declared in src/hooks/hooks.json but nothing would invoke them: ${unreachable.join(", ")}. ` +
      `Install the plugin, or register them in ~/.claude/settings.json.`,
  )
})
