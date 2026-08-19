import assert from "node:assert/strict"
import test from "node:test"
import { createHash } from "node:crypto"
import { parseGuidancePolicy } from "./parseGuidancePolicy"
import { validateReconciliationResult } from "./validators/validateReconciliationResult"

void test("policy parsing accepts only the constrained policy contract", () => {
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials.", "Use official documentation."],
    officialDocumentationOrigins: [
      "https://docs.anthropic.com",
      "https://developers.openai.com",
      "https://github.com",
    ],
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  assert.deepEqual(parseGuidancePolicy(policy), { ok: true, policy })
  const rejected = parseGuidancePolicy({ ...policy, claudeTarget: "unsafe-target" })
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join("\n"), /unknown property/u)
})

void test("policy parsing rejects literal credentials", () => {
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: ["https://docs.anthropic.com"],
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
    officialDocumentationOrigins: ["https://docs.anthropic.com", "https://developers.openai.com"],
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: { "canonical/shared.md": digest("shared") },
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
  assert.deepEqual(validateReconciliationResult(result, policy, result.inputHashes), {
    ok: true,
    result,
  })
})

void test("reconciliation result fails closed for stale input hashes", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: ["https://docs.anthropic.com", "https://developers.openai.com"],
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: { "canonical/shared.md": digest("shared") },
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
  const rejected = validateReconciliationResult(result, policy, {
    "canonical/shared.md": digest("changed"),
  })
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join("\n"), /input hashes/u)
})

void test("reconciliation result rejects missing official documentation evidence", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: ["https://docs.anthropic.com", "https://developers.openai.com"],
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: { "canonical/shared.md": digest("shared") },
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
  const rejected = validateReconciliationResult(result, policy, result.inputHashes)
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join("\n"), /Codex documentation/u)
})

void test("reconciliation result rejects unresolved Claude imports in Codex output", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: ["https://docs.anthropic.com", "https://developers.openai.com"],
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const result = {
    version: 1,
    inputHashes: { "canonical/shared.md": digest("shared") },
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
  const rejected = validateReconciliationResult(result, policy, result.inputHashes)
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join("\n"), /Claude import/u)
})

void test("reconciliation result rejects secret and captured-conversation material", () => {
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const policy = {
    version: 1 as const,
    requiredInvariants: ["Never expose credentials."],
    officialDocumentationOrigins: ["https://docs.anthropic.com", "https://developers.openai.com"],
    maxOutputBytes: 20_000,
    agentCommand: ["fake-agent"],
    timeoutMs: 5_000,
  }
  const base = {
    version: 1,
    inputHashes: { "canonical/shared.md": digest("shared") },
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
  assert.equal(validateReconciliationResult(secret, policy, secret.inputHashes).ok, false)
  assert.equal(
    validateReconciliationResult(conversation, policy, conversation.inputHashes).ok,
    false,
  )
})
