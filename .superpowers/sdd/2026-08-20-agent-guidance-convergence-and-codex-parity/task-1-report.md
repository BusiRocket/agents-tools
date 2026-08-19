# Guidance reconciliation engine report

## Status

Completed Tasks 1 and 2 together.

## Files

- `scripts/lib/guidance/**`: policy/result contracts, source collection, prompt construction, constrained agent execution, validation, snapshots, transactional apply, rollback, doctor, and focused tests.
- `scripts/commands/guidanceSync.ts`, `guidanceDoctor.ts`, and `guidanceRollback.ts`: command entry points.
- `scripts/bin/run-guidance-*.ts`: executable runners.
- `scripts/schemas/guidance-reconciliation.schema.json`: strict agent-result schema.
- `package.json`: `guidance:sync`, `guidance:doctor`, `guidance:rollback`, and `guidance:test` scripts.

## Design decisions

- Policy parsing rejects unknown properties, arbitrary target-path settings, malformed HTTPS documentation origins, oversized limits, invalid commands, and credential literals without echoing the secret.
- The agent result is schema-shaped and hash-bound to all collected source inputs. It requires current official Claude and Codex evidence from the policy allowlist, enforces both rendered invariants, rejects secret/captured-conversation material, bounds output bytes, and rejects Claude imports in Codex Markdown.
- Source collection includes canonical files, live Claude/Codex documents, direct hand-maintained Claude rules, prior accepted state, and the generated index-only Claude rule inventory. It does not ingest generated rule bodies.
- Agent execution uses an argument array without a shell, a bounded stdout buffer, a timeout, JSON-only parsing, and a prompt that carries the output schema and no-write boundary.
- Apply snapshots all canonical and live guidance files plus accepted state before writes. Each write uses a `0600`, fsynced temporary file and atomic rename. Any later failure restores the full snapshot. Rollback restores only a complete accepted run and validates every snapshot target against fixed trusted paths.
- Tests use fresh OS temporary homes and deterministic fake agents only.

## Verification

All commands were run from `/Users/cristiandeluxe/p/rocket-agents`.

```text
pnpm run guidance:test
10 passed, 0 failed

pnpm run type-check
exit 0

pnpm run lint -- scripts/lib/guidance scripts/commands/guidanceSync.ts scripts/commands/guidanceDoctor.ts scripts/commands/guidanceRollback.ts scripts/bin/run-guidance-sync.ts scripts/bin/run-guidance-doctor.ts scripts/bin/run-guidance-rollback.ts
exit 0

git diff --check
exit 0
```

## Fix round 3

- Evidence validation now requires explicit start and end boundaries from the sync run; the test fake emits retrieval timestamps only after the agent begins.
- Added direct Claude and Codex target-syntax fixtures, including root, relative, indented, inline import forms and ordinary `@` prose.

```text
pnpm run guidance:test
11 passed, 0 failed

pnpm run type-check
exit 0
```

Focused coverage includes valid/rejected policy and result contracts, stale input hashes, missing documentation evidence, unresolved Claude imports in Codex output, secret/conversation rejection, successful apply and explicit rollback, invalid agent output with no writes, and rollback after a forced late transactional failure.

## Self-review

- No machine apply, linker, or durable user configuration command was run.
- The agent result never supplies write paths; target paths are derived by the wrapper.
- Snapshot content hashes are verified before restoration.
- A run is rollback-eligible only after its completion marker is written.
- The implementation uses one exported unit per source file and explicit imports.

## Concerns

- No private canonical policy or real external reconciler was available in this public repository, so real-provider documentation retrieval and a real-agent invocation were intentionally not executed. The wrapper will fail closed if either does not meet the validated contract.
- The private scheduler and canonical guidance content remain owned by `dotfiles` and are outside this task's permitted scope.

## Fix round 1

### Completed hardening

- The configured reconciler now requires an absolute executable and runs through the macOS sandbox with a sanitized environment, root working directory, no usable home directory, and file writes denied outside a newly created private temporary runtime directory.
- The engine recollects all sources after the agent exits and rejects any content drift before snapshots or writes.
- Snapshot files, manifest, completion marker, and run directories are fsynced. Apply rollback failures are surfaced rather than suppressed, and restore validates snapshot hashes and trusted target bindings.
- Documentation origins are provider-specific. Evidence is independently URL-checked against the correct provider allowlist and must be contemporaneous with the run window.
- Nested result objects reject extra fields, the sensitive-content scan covers the complete validated result, source collection tolerates only `ENOENT`, accepted state now persists rendered-output hashes, and Codex import detection covers root, relative, inline, and indented import forms.

### Verification

```text
pnpm run guidance:test
10 passed, 0 failed

pnpm run type-check
exit 0

pnpm run lint -- scripts/lib/guidance scripts/commands/guidanceSync.ts scripts/commands/guidanceDoctor.ts scripts/commands/guidanceRollback.ts scripts/bin/run-guidance-sync.ts scripts/bin/run-guidance-doctor.ts scripts/bin/run-guidance-rollback.ts
exit 0

git diff --check
exit 0
```

### Remaining concern

The public implementation uses macOS `sandbox-exec`, which is the available hardened runner on this host. A portable Linux sandbox adapter remains a future platform-specific extension.

## Fix round 2

- Added runtime Draft 2020-12 schema execution with Ajv and URI format validation before semantic checks.
- Added explicit Claude and Codex target validators; Codex rejects root, relative, indented, and inline Claude imports.
- Added fail-closed platform sandbox command selection: macOS `sandbox-exec`, Linux `bwrap` when installed, and rejection for unsupported or unavailable runtimes.
- Evidence validation now receives run boundaries from sync and validates provider-specific URLs before semantic use.

```text
pnpm run guidance:test
10 passed, 0 failed

pnpm run type-check
exit 0

pnpm run lint -- scripts/lib/guidance
exit 0

git diff --check
exit 0
```
