import assert from "node:assert/strict"
import test from "node:test"
import { createHash } from "node:crypto"
import { createSandboxCommand } from "./createSandboxCommand"
import { parseGuidancePolicy } from "./parseGuidancePolicy"
import { validateReconciliationResult } from "./validators/validateReconciliationResult"
import { validateReconciliationSchema } from "./validators/validateReconciliationSchema"
import { validateClaudeTargetSyntax } from "./validators/validateClaudeTargetSyntax"
import { validateCodexTargetSyntax } from "./validators/validateCodexTargetSyntax"

void test("policy parsing accepts only the constrained policy contract", () => {
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials.", "Use official documentation."],
    officialDocumentationOrigins: {
      claude: ["https://docs.anthropic.com"],
      codex: ["https://developers.openai.com", "https://github.com"],
    },
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  assert.deepEqual(parseGuidancePolicy(policy), { ok: true, policy })
  const rejected = parseGuidancePolicy({ ...policy, claudeTarget: "unsafe-target" })
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join("\n"), /unknown property/u)
  assert.equal(parseGuidancePolicy({ ...policy, timeoutMs: 300_000 }).ok, true)
  const excessiveTimeout = parseGuidancePolicy({ ...policy, timeoutMs: 300_001 })
  assert.equal(excessiveTimeout.ok, false)
  assert.match(excessiveTimeout.errors.join("\n"), /between 1000 and 300000/u)
})

void test("policy parsing rejects literal credentials", () => {
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: {
      claude: ["https://docs.anthropic.com"],
      codex: ["https://developers.openai.com"],
    },
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const rejected = parseGuidancePolicy({
    ...policy,
    agentCommand: ["fake", "--token=supersecretvalue"],
  })
  assert.equal(rejected.ok, false)
  assert.equal(JSON.stringify(rejected).includes("supersecretvalue"), false)
})

void test("reconciliation result accepts matching hashes, documentation, and invariants", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials.", "Use official documentation."],
    officialDocumentationOrigins: {
      claude: ["https://docs.anthropic.com"],
      codex: ["https://developers.openai.com"],
    },
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: [{ path: "canonical/shared.md", sha256: digest("shared") }],
    shared: "Never expose credentials.\nUse official documentation.\n",
    claudeOverlay: "Claude-specific guidance.\n",
    codexOverlay: "Codex-specific guidance.\n",
    claudeDocument: "Never expose credentials.\nUse official documentation.\n",
    codexDocument: "Never expose credentials.\nUse official documentation.\n",
    documentation: [
      {
        provider: "claude" as const,
        url: "https://docs.anthropic.com/en/docs/claude-code",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
      {
        provider: "codex" as const,
        url: "https://developers.openai.com/codex",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
    ],
    decisions: [
      {
        action: "preserved" as const,
        source: "shared" as const,
        rationale: "The invariant is unchanged.",
      },
    ],
    warnings: [],
    unresolvedLimitations: [],
  }
  assert.deepEqual(
    validateReconciliationResult(
      result,
      policy,
      { "canonical/shared.md": digest("shared") },
      new Date(0),
      new Date("2100-01-01T00:00:00.000Z"),
    ),
    {
      ok: true,
      result,
    },
  )
})

void test("reconciliation result fails closed for stale input hashes", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: {
      claude: ["https://docs.anthropic.com"],
      codex: ["https://developers.openai.com"],
    },
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: [{ path: "canonical/shared.md", sha256: digest("shared") }],
    shared: "Never expose credentials.\n",
    claudeOverlay: "Claude.\n",
    codexOverlay: "Codex.\n",
    claudeDocument: "Never expose credentials.\n",
    codexDocument: "Never expose credentials.\n",
    documentation: [
      {
        provider: "claude" as const,
        url: "https://docs.anthropic.com/en/docs/claude-code",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
      {
        provider: "codex" as const,
        url: "https://developers.openai.com/codex",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
    ],
    decisions: [],
    warnings: [],
    unresolvedLimitations: [],
  }
  const rejected = validateReconciliationResult(
    result,
    policy,
    {
      "canonical/shared.md": digest("changed"),
    },
    new Date(0),
    new Date("2100-01-01T00:00:00.000Z"),
  )
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join("\n"), /input hashes/u)
})

void test("reconciliation result rejects missing official documentation evidence", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: {
      claude: ["https://docs.anthropic.com"],
      codex: ["https://developers.openai.com"],
    },
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: [{ path: "canonical/shared.md", sha256: digest("shared") }],
    shared: "Never expose credentials.\n",
    claudeOverlay: "Claude.\n",
    codexOverlay: "Codex.\n",
    claudeDocument: "Never expose credentials.\n",
    codexDocument: "Never expose credentials.\n",
    documentation: [
      {
        provider: "claude" as const,
        url: "https://docs.anthropic.com/en/docs/claude-code",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
    ],
    decisions: [],
    warnings: [],
    unresolvedLimitations: [],
  }
  const rejected = validateReconciliationResult(
    result,
    policy,
    { "canonical/shared.md": digest("shared") },
    new Date(0),
    new Date("2100-01-01T00:00:00.000Z"),
  )
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join("\n"), /Codex documentation/u)
})

void test("reconciliation result rejects unresolved Claude imports in Codex output", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: {
      claude: ["https://docs.anthropic.com"],
      codex: ["https://developers.openai.com"],
    },
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: [{ path: "canonical/shared.md", sha256: digest("shared") }],
    shared: "Never expose credentials.\n",
    claudeOverlay: "Claude.\n",
    codexOverlay: "Codex.\n",
    claudeDocument: "Never expose credentials.\n",
    codexDocument: "@rules/navigation.md\nNever expose credentials.\n",
    documentation: [
      {
        provider: "claude" as const,
        url: "https://docs.anthropic.com/en/docs/claude-code",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
      {
        provider: "codex" as const,
        url: "https://developers.openai.com/codex",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
    ],
    decisions: [],
    warnings: [],
    unresolvedLimitations: [],
  }
  const rejected = validateReconciliationResult(
    result,
    policy,
    { "canonical/shared.md": digest("shared") },
    new Date(0),
    new Date("2100-01-01T00:00:00.000Z"),
  )
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join("\n"), /Claude import/u)
})

void test("reconciliation result rejects secret and captured-conversation material", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: {
      claude: ["https://docs.anthropic.com"],
      codex: ["https://developers.openai.com"],
    },
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const base = {
    version: 1,
    inputHashes: [{ path: "canonical/shared.md", sha256: digest("shared") }],
    claudeOverlay: "Claude.\n",
    codexOverlay: "Codex.\n",
    codexDocument: "Never expose credentials.\n",
    documentation: [
      {
        provider: "claude" as const,
        url: "https://docs.anthropic.com/en/docs/claude-code",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
      {
        provider: "codex" as const,
        url: "https://developers.openai.com/codex",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
    ],
    decisions: [],
    warnings: [],
    unresolvedLimitations: [],
  }
  const secret = {
    ...base,
    shared: "token=supersecretvalue",
    claudeDocument: "Never expose credentials.\n",
  }
  const conversation = {
    ...base,
    shared: "Never expose credentials.\n",
    claudeDocument: '{"type":"session_meta","payload":{}}',
  }
  assert.equal(
    validateReconciliationResult(
      secret,
      policy,
      { "canonical/shared.md": digest("shared") },
      new Date(0),
      new Date("2100-01-01T00:00:00.000Z"),
    ).ok,
    false,
  )
  assert.equal(
    validateReconciliationResult(
      conversation,
      policy,
      { "canonical/shared.md": digest("shared") },
      new Date(0),
      new Date("2100-01-01T00:00:00.000Z"),
    ).ok,
    false,
  )
})

void test("target syntax validators handle documented Claude imports and every Codex import form", () => {
  assert.deepEqual(validateClaudeTargetSyntax("@rules/navigation.md\nordinary @mention prose"), [])
  assert.notDeepEqual(validateClaudeTargetSyntax("text\0"), [])
  for (const value of ["@rules.md", "@rules/navigation.md", "  @rules.md", "see @rules.md now"])
    assert.notDeepEqual(validateCodexTargetSyntax(value), [])
  assert.deepEqual(validateCodexTargetSyntax("ordinary @mention prose"), [])
})

void test("documentation evidence must be retrieved within the exact run window", () => {
  const runStartedAt = new Date("2026-08-20T10:00:00.000Z")
  const runEndedAt = new Date("2026-08-20T10:10:00.000Z")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: {
      claude: ["https://docs.anthropic.com"],
      codex: ["https://developers.openai.com"],
    },
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: [{ path: "canonical/shared.md", sha256: "a".repeat(64) }],
    shared: "Never expose credentials.\n",
    claudeOverlay: "Claude.\n",
    codexOverlay: "Codex.\n",
    claudeDocument: "Never expose credentials.\n",
    codexDocument: "Never expose credentials.\n",
    documentation: [
      {
        provider: "claude" as const,
        url: "https://docs.anthropic.com/en/docs/claude-code",
        retrievedAt: runStartedAt.toISOString(),
      },
      {
        provider: "codex" as const,
        url: "https://developers.openai.com/codex",
        retrievedAt: runEndedAt.toISOString(),
      },
    ],
    decisions: [],
    warnings: [],
    unresolvedLimitations: [],
  }
  assert.equal(
    validateReconciliationResult(
      result,
      policy,
      { "canonical/shared.md": "a".repeat(64) },
      runStartedAt,
      runEndedAt,
    ).ok,
    true,
  )
  for (const [name, retrievedAt] of [
    ["before start", "2026-08-20T09:59:59.999Z"],
    ["after end", "2026-08-20T10:10:00.001Z"],
    ["future", "9999-12-31T23:59:59.999Z"],
  ] as const) {
    const rejected = validateReconciliationResult(
      {
        ...result,
        documentation: result.documentation.map((item) => ({ ...item, retrievedAt })),
      },
      policy,
      { "canonical/shared.md": "a".repeat(64) },
      runStartedAt,
      runEndedAt,
    )
    assert.equal(rejected.ok, false, `${name} evidence must be rejected`)
    assert.match(rejected.errors.join("\n"), /missing current official/u)
  }
})

void test("runtime schema rejects invalid evidence URIs and nested extra properties", () => {
  const result = {
    version: 1,
    inputHashes: [{ path: "canonical/shared.md", sha256: "a".repeat(64) }],
    shared: "shared",
    claudeOverlay: "claude",
    codexOverlay: "codex",
    claudeDocument: "claude",
    codexDocument: "codex",
    documentation: [
      {
        provider: "claude",
        url: "https://docs.anthropic.com/en/docs/claude-code",
        retrievedAt: "2026-08-20T10:00:00.000Z",
      },
    ],
    decisions: [],
    warnings: [],
    unresolvedLimitations: [],
  }
  assert.match(
    validateReconciliationSchema({
      ...result,
      documentation: [{ ...result.documentation[0], url: "not a URI" }],
    }).join("\n"),
    /pattern/u,
  )
  assert.match(
    validateReconciliationSchema({
      ...result,
      documentation: [{ ...result.documentation[0], unexpected: true }],
    }).join("\n"),
    /additional properties/u,
  )
})

void test("sandbox command selection fails closed without a supported runtime", () => {
  const options = {
    scratchDir: "/sandbox/scratch",
    command: "/usr/bin/true",
    args: [] as string[],
  }
  assert.throws(
    () =>
      createSandboxCommand({
        ...options,
        platform: "linux",
        pathExists: () => false,
      }),
    /required Linux sandbox runtime bwrap is unavailable/u,
  )
  assert.throws(
    () => createSandboxCommand({ ...options, platform: "win32" }),
    /unsupported sandbox platform: win32/u,
  )
})
