import assert from "node:assert/strict"
import { access, mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { applyGuidanceResult } from "./applyGuidanceResult"
import { guidanceRollback } from "./guidanceRollback"
import { guidanceSync } from "./guidanceSync"

void test("sync snapshots and atomically applies canonical and live documents, then rollback restores all", async () => {
  const hash = async (value: string) => {
    const { createHash } = await import("node:crypto")
    return createHash("sha256").update(value).digest("hex")
  }
  const createFakeAgent = async (root: string, result: object) => {
    const path = join(root, "fake-agent.mjs")
    await writeFile(
      path,
      `const result=${JSON.stringify(result)}; process.stdin.resume(); process.stdin.on("end", () => { result.documentation.forEach((item) => { item.retrievedAt = new Date().toISOString() }); process.stdout.write(JSON.stringify(result)) })`,
    )
    return path
  }
  const root = await mkdtemp(join(tmpdir(), "guidance-sync-"))
  const home = join(root, "home")
  const canonical = join(root, "canonical")
  await Promise.all([
    mkdir(join(home, ".claude", "rules"), { recursive: true }),
    mkdir(join(home, ".codex"), { recursive: true }),
    mkdir(canonical),
  ])
  await Promise.all([
    writeFile(join(canonical, "shared.md"), "old shared\n"),
    writeFile(join(canonical, "claude-overlay.md"), "old claude overlay\n"),
    writeFile(join(canonical, "codex-overlay.md"), "old codex overlay\n"),
    writeFile(join(home, ".claude", "CLAUDE.md"), "old claude\n"),
    writeFile(join(home, ".codex", "AGENTS.md"), "old codex\n"),
    writeFile(join(home, ".claude", "rules", "navigation.md"), "hand maintained rule\n"),
  ])
  const inputHashes = {
    "canonical/shared.md": await hash("old shared\n"),
    "canonical/claude-overlay.md": await hash("old claude overlay\n"),
    "canonical/codex-overlay.md": await hash("old codex overlay\n"),
    "live/claude/CLAUDE.md": await hash("old claude\n"),
    "live/codex/AGENTS.md": await hash("old codex\n"),
    "claude-rules/navigation.md": await hash("hand maintained rule\n"),
    "state/accepted.json": await hash(""),
    "generated/rules-inventory": await hash(""),
  }
  const result = {
    version: 1,
    inputHashes,
    shared: "Never expose credentials.\n",
    claudeOverlay: "Claude overlay\n",
    codexOverlay: "Codex overlay\n",
    claudeDocument: "Never expose credentials.\n",
    codexDocument: "Never expose credentials.\n",
    documentation: [
      {
        provider: "claude",
        url: "https://docs.anthropic.com/en/docs/claude-code",
        retrievedAt: new Date().toISOString(),
      },
      {
        provider: "codex",
        url: "https://developers.openai.com/codex",
        retrievedAt: new Date().toISOString(),
      },
    ],
    decisions: [{ action: "promoted", source: "claude", rationale: "Sync both clients." }],
    warnings: [],
    unresolvedLimitations: [],
  }
  const fakeAgent = await createFakeAgent(root, result)
  await writeFile(
    join(canonical, "policy.json"),
    JSON.stringify({
      version: 1,
      requiredInvariants: ["Never expose credentials."],
      officialDocumentationOrigins: {
        claude: ["https://docs.anthropic.com"],
        codex: ["https://developers.openai.com"],
      },
      maxOutputBytes: 20_000,
      agentCommand: [process.execPath, fakeAgent],
      timeoutMs: 5_000,
    }),
  )

  const report = await guidanceSync({
    home,
    canonicalDir: canonical,
    stateDir: join(root, "state"),
    rulesInventoryPath: join(root, "missing-rules-inventory.md"),
  })
  assert.equal(report.ok, true)
  assert.equal(await readFile(join(home, ".codex", "AGENTS.md"), "utf8"), result.codexDocument)
  assert.equal(await readFile(join(canonical, "shared.md"), "utf8"), result.shared)
  assert.equal((await stat(join(home, ".codex", "AGENTS.md"))).mode & 0o777, 0o600)
  await access(join(report.snapshotDir, "complete"))

  const rolledBack = await guidanceRollback({
    home,
    canonicalDir: canonical,
    stateDir: join(root, "state"),
  })
  assert.equal(rolledBack.ok, true)
  assert.equal(await readFile(join(home, ".claude", "CLAUDE.md"), "utf8"), "old claude\n")
  assert.equal(await readFile(join(canonical, "shared.md"), "utf8"), "old shared\n")
})

void test("sync leaves all files untouched when agent output fails validation", async () => {
  const root = await mkdtemp(join(tmpdir(), "guidance-invalid-"))
  const home = join(root, "home")
  const canonical = join(root, "canonical")
  await Promise.all([
    mkdir(join(home, ".claude"), { recursive: true }),
    mkdir(join(home, ".codex"), { recursive: true }),
    mkdir(canonical),
  ])
  await Promise.all([
    writeFile(join(canonical, "shared.md"), "old\n"),
    writeFile(join(canonical, "claude-overlay.md"), "old\n"),
    writeFile(join(canonical, "codex-overlay.md"), "old\n"),
    writeFile(join(home, ".claude", "CLAUDE.md"), "old claude\n"),
    writeFile(join(home, ".codex", "AGENTS.md"), "old codex\n"),
  ])
  const fakeAgent = join(root, "fake-agent.mjs")
  await writeFile(
    fakeAgent,
    `process.stdin.resume(); process.stdin.on("end", () => process.stdout.write('{"version":1}'))`,
  )
  await writeFile(
    join(canonical, "policy.json"),
    JSON.stringify({
      version: 1,
      requiredInvariants: ["Invariant"],
      officialDocumentationOrigins: {
        claude: ["https://docs.anthropic.com"],
        codex: ["https://developers.openai.com"],
      },
      maxOutputBytes: 20_000,
      agentCommand: [process.execPath, fakeAgent],
      timeoutMs: 5_000,
    }),
  )
  const report = await guidanceSync({
    home,
    canonicalDir: canonical,
    stateDir: join(root, "state"),
    rulesInventoryPath: join(root, "missing-rules-inventory.md"),
  })
  assert.equal(report.ok, false)
  assert.equal(await readFile(join(home, ".codex", "AGENTS.md"), "utf8"), "old codex\n")
  assert.equal(await readFile(join(canonical, "shared.md"), "utf8"), "old\n")
  await assert.rejects(access(join(root, "state", "runs")))
})

void test(
  "sync rejects an agent that attempts to write outside its private scratch directory",
  { skip: process.platform !== "darwin" },
  async () => {
    const root = await mkdtemp(join(tmpdir(), "guidance-sandbox-"))
    const home = join(root, "home")
    const canonical = join(root, "canonical")
    const outsideDir = join(root, "outside")
    const outsideTarget = join(outsideDir, "escaped.txt")
    await Promise.all([mkdir(home), mkdir(canonical), mkdir(outsideDir)])
    const fakeAgent = join(root, "adversarial-agent.mjs")
    await writeFile(
      fakeAgent,
      `import { writeFileSync } from "node:fs"; writeFileSync(process.argv[2], "escaped")`,
    )
    await writeFile(
      join(canonical, "policy.json"),
      JSON.stringify({
        version: 1,
        requiredInvariants: ["Invariant"],
        officialDocumentationOrigins: {
          claude: ["https://docs.anthropic.com"],
          codex: ["https://developers.openai.com"],
        },
        maxOutputBytes: 20_000,
        agentCommand: [process.execPath, fakeAgent, outsideTarget],
        timeoutMs: 5_000,
      }),
    )

    const report = await guidanceSync({
      home,
      canonicalDir: canonical,
      stateDir: join(root, "state"),
      rulesInventoryPath: join(root, "missing-rules-inventory.md"),
    })

    assert.equal(report.ok, false)
    assert.match(report.errors.join("\n"), /agent exited with code 1/u)
    await assert.rejects(access(outsideTarget), { code: "ENOENT" })
  },
)

void test("a failed finalization restores every file from the run snapshot", async () => {
  const root = await mkdtemp(join(tmpdir(), "guidance-transaction-"))
  const home = join(root, "home")
  const canonical = join(root, "canonical")
  const state = join(root, "state")
  await Promise.all([
    mkdir(join(home, ".claude"), { recursive: true }),
    mkdir(join(home, ".codex"), { recursive: true }),
    mkdir(join(state, "runs", "r1"), { recursive: true }),
    mkdir(canonical),
  ])
  await Promise.all([
    writeFile(join(canonical, "shared.md"), "old shared\n"),
    writeFile(join(canonical, "claude-overlay.md"), "old claude overlay\n"),
    writeFile(join(canonical, "codex-overlay.md"), "old codex overlay\n"),
    writeFile(join(home, ".claude", "CLAUDE.md"), "old claude\n"),
    writeFile(join(home, ".codex", "AGENTS.md"), "old codex\n"),
    writeFile(join(state, "runs", "r1", "complete"), "occupied"),
  ])
  const result = {
    version: 1 as const,
    inputHashes: {},
    shared: "new shared\n",
    claudeOverlay: "new claude overlay\n",
    codexOverlay: "new codex overlay\n",
    claudeDocument: "new claude\n",
    codexDocument: "new codex\n",
    documentation: [],
    decisions: [],
    warnings: [],
    unresolvedLimitations: [],
  }
  await assert.rejects(
    applyGuidanceResult({ home, canonicalDir: canonical, stateDir: state, runId: "r1", result }),
  )
  assert.equal(await readFile(join(canonical, "shared.md"), "utf8"), "old shared\n")
  assert.equal(await readFile(join(home, ".claude", "CLAUDE.md"), "utf8"), "old claude\n")
  assert.equal(await readFile(join(home, ".codex", "AGENTS.md"), "utf8"), "old codex\n")
})
