import assert from "node:assert/strict"
import test from "node:test"
import { plan } from "./plan"
import type { McpManifest } from "./McpManifest"
import type { McpState } from "./read"

const emptyOwned = { "claude-personal": [], "claude-favish": [], codex: [], gemini: [] }

const emptyState: McpState = {
  byTarget: { "claude-personal": {}, "claude-favish": {}, codex: {}, gemini: {} },
}

const manifest: McpManifest = {
  servers: { serena: { targets: ["claude-personal"], transport: "stdio", command: "uvx" } },
}

const stateWith = (servers: Record<string, unknown>): McpState => ({
  byTarget: { "claude-personal": servers, "claude-favish": {}, codex: {}, gemini: {} },
})

void test("a server missing from the machine is added", () => {
  const changes = plan({ manifest, state: emptyState, owned: emptyOwned, env: {} })
  assert.deepEqual(changes, [{ target: "claude-personal", name: "serena", operation: "add" }])
})

void test("an identical server produces no change", () => {
  const state = stateWith({ serena: { type: "stdio", command: "uvx" } })
  const owned = { ...emptyOwned, "claude-personal": ["serena"] }
  assert.deepEqual(plan({ manifest, state, owned, env: {} }), [])
})

void test("a differing server is updated", () => {
  const state = stateWith({ serena: { type: "stdio", command: "old-command" } })
  const owned = { ...emptyOwned, "claude-personal": ["serena"] }
  assert.deepEqual(plan({ manifest, state, owned, env: {} }), [
    { target: "claude-personal", name: "serena", operation: "update" },
  ])
})

void test("an owned server dropped from the manifest is removed", () => {
  const state = stateWith({
    serena: { type: "stdio", command: "uvx" },
    stale: { type: "stdio" },
  })
  const owned = { ...emptyOwned, "claude-personal": ["serena", "stale"] }
  assert.deepEqual(plan({ manifest, state, owned, env: {} }), [
    { target: "claude-personal", name: "stale", operation: "remove" },
  ])
})

void test("a foreign server is never removed", () => {
  const state = stateWith({
    serena: { type: "stdio", command: "uvx" },
    someoneElse: { type: "stdio" },
  })
  const owned = { ...emptyOwned, "claude-personal": ["serena"] }
  assert.deepEqual(plan({ manifest, state, owned, env: {} }), [])
})

void test("a server needing a missing secret is not planned as an add", () => {
  const secretManifest: McpManifest = {
    servers: {
      context7: {
        targets: ["claude-personal"],
        transport: "http",
        url: "https://mcp.context7.com/mcp",
        headers: { CONTEXT7_API_KEY: { from_env: "ABSENT" } },
      },
    },
  }
  assert.deepEqual(
    plan({ manifest: secretManifest, state: emptyState, owned: emptyOwned, env: {} }),
    [],
  )
})
