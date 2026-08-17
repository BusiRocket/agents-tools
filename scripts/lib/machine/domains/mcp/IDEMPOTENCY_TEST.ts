import assert from "node:assert/strict"
import { mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { apply } from "./apply"
import { parseMcpManifest } from "./parseMcpManifest"
import { plan } from "./plan"
import { read } from "./read"
import type { McpManifest, McpTarget } from "./McpManifest"

const EMPTY_OWNED: Record<McpTarget, string[]> = {
  "claude-personal": [],
  "claude-favish": [],
  codex: [],
  gemini: [],
}

const ENV = { CONTEXT7_API_KEY: "test-key" }

const setup = async () => {
  const dir = await mkdtemp(join(tmpdir(), "machine-idem-"))
  const paths: Record<McpTarget, string> = {
    "claude-personal": join(dir, "claude.json"),
    "claude-favish": join(dir, "favish.json"),
    codex: join(dir, "config.toml"),
    gemini: join(dir, "gemini.json"),
  }

  await writeFile(paths["claude-personal"], JSON.stringify({ theme: "dark", mcpServers: {} }))
  await writeFile(paths["claude-favish"], "{}")
  await writeFile(paths.codex, 'model = "gpt-5.6-sol"\n')
  await writeFile(paths.gemini, "")

  return paths
}

const exampleManifest = async (): Promise<McpManifest> => {
  const raw = JSON.parse(await readFile("examples/machine/mcp.json", "utf8")) as unknown
  const parsed = parseMcpManifest(raw)

  if (!parsed.ok) {
    throw new Error(`example manifest must be valid: ${parsed.errors.join(", ")}`)
  }

  return parsed.manifest
}

void test("a second apply changes nothing", async () => {
  const paths = await setup()
  const manifest = await exampleManifest()

  const first = await apply({ manifest, paths, owned: EMPTY_OWNED, env: ENV })
  const afterFirst = await Promise.all(
    Object.values(paths).map((path) => readFile(path, "utf8")),
  )

  const second = await apply({ manifest, paths, owned: first.owned, env: ENV })
  const afterSecond = await Promise.all(
    Object.values(paths).map((path) => readFile(path, "utf8")),
  )

  assert.deepEqual(afterSecond, afterFirst)

  const changes = plan({ manifest, state: await read(paths), owned: second.owned, env: ENV })
  assert.deepEqual(changes, [])
})

void test("a foreign key added between runs is not disturbed", async () => {
  const paths = await setup()
  const manifest = await exampleManifest()

  const first = await apply({ manifest, paths, owned: EMPTY_OWNED, env: ENV })

  const config = JSON.parse(await readFile(paths["claude-personal"], "utf8")) as Record<
    string,
    unknown
  >
  const servers = config["mcpServers"] as Record<string, unknown>
  servers["injectedByAnotherTool"] = { type: "stdio", command: "x" }
  await writeFile(paths["claude-personal"], JSON.stringify(config, null, 2))

  await apply({ manifest, paths, owned: first.owned, env: ENV })

  const after = JSON.parse(await readFile(paths["claude-personal"], "utf8")) as {
    mcpServers: Record<string, unknown>
  }
  assert.equal("injectedByAnotherTool" in after.mcpServers, true)
})

void test("a foreign codex block added between runs is not disturbed", async () => {
  const paths = await setup()
  const manifest = await exampleManifest()

  const first = await apply({ manifest, paths, owned: EMPTY_OWNED, env: ENV })

  const current = await readFile(paths.codex, "utf8")
  await writeFile(paths.codex, `${current}\n[mcp_servers.someoneElse]\ncommand = "keep"\n`)

  await apply({ manifest, paths, owned: first.owned, env: ENV })

  const after = await readFile(paths.codex, "utf8")
  assert.match(after, /\[mcp_servers\.someoneElse\]/)
  assert.match(after, /model = "gpt-5\.6-sol"/)
})

void test("dropping a server from the manifest removes it from every target", async () => {
  const paths = await setup()
  const manifest = await exampleManifest()

  const first = await apply({ manifest, paths, owned: EMPTY_OWNED, env: ENV })

  const reduced: McpManifest = { servers: {} }
  for (const [name, server] of Object.entries(manifest.servers)) {
    if (name !== "codegraph") {
      reduced.servers[name] = server
    }
  }

  await apply({ manifest: reduced, paths, owned: first.owned, env: ENV })

  const claude = JSON.parse(await readFile(paths["claude-personal"], "utf8")) as {
    mcpServers: Record<string, unknown>
  }
  assert.equal("codegraph" in claude.mcpServers, false)
  assert.equal((await readFile(paths.codex, "utf8")).includes("mcp_servers.codegraph"), false)
})

void test("a missing secret leaves the server out and is reported", async () => {
  const paths = await setup()
  const manifest = await exampleManifest()

  const result = await apply({ manifest, paths, owned: EMPTY_OWNED, env: {} })

  assert.equal(result.missing.includes("CONTEXT7_API_KEY"), true)

  const claude = JSON.parse(await readFile(paths["claude-personal"], "utf8")) as {
    mcpServers: Record<string, unknown>
  }
  assert.equal("context7" in claude.mcpServers, false)
  assert.equal("serena" in claude.mcpServers, true)
})
