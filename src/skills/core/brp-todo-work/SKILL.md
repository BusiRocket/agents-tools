---
name: brp-todo-work
description:
  Execute a project's existing TODO backlog end to end, advancing every safe actionable item until
  it is verified complete, blocked with evidence, or superseded, and recording closed work in
  TODO_LOG.md. Trigger when the task is to work through TODO.md, clear the backlog, or resume
  autonomous TODO execution in the current repository. Do not use for building a backlog from
  conversation history, for a single named bug fix or feature, or for review of already-finished
  work.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, TodoWrite, Task
argument-hint: [scope-or-category]
---

## Rules

- Scope is the current repository and its project-owned TODO files. English in every artifact.
- No commit, push, branch, or PR unless the user or project instructions authorize it.
- Hosted CI, cloud builds, paid API calls, bulk backfills and scheduled jobs are external side
  effects. Prefer equivalent local validation and record the missing remote proof honestly.
- Never put secret values or personal data in TODO notes, logs, commits, or chat.
- Fix root causes in the owning source, not with suppressions, skipped checks, or local patches.
- Preserve unrelated changes in a dirty worktree. Do not edit an existing migration without
  confirmation.
- `[x]` requires a command result or equivalent external evidence, never a reading of the diff.

## Approval gate

Reconstruction and read-only inspection need no approval. Stop before the first write and present:
items to execute this run (one line each: task, intended outcome, validation), items excluded with
the reason, anything needing new authority, and the declared caps below. Then ask to approve,
approve with changes, or decline. Approved with changes restates the queue once and starts; declined
stops without changing anything.

Re-approve only on material change: new items outside the approved list, a newly discovered action
needing authority, or scope growing well beyond what was presented.

Escalate mid-run on unclear requirements, missing technical detail, conflicting constraints, or
unspecified budget or timeline. Do not escalate details already covered by the approved plan.

A run-scoped waiver ("execute without asking") skips this gate but never covers actions that
independently require authority.

## Caps

Declare all four in the plan and stop when any is hit, reporting a checkpointed incomplete run:

- iteration count, token budget, and wall time;
- no-progress: two consecutive waves closing no item and producing no new evidence.

Flaky checks get exactly one retry, so noise does not read as divergence.

## Workflow

1. Read applicable instruction files, `git status`, recent history, and every project-owned
   `TODO.md`, `TODO_LOG.md`, `TODO_HISTORY_INDEX.jsonl`. Ignore vendor and generated files. With no
   project-owned TODO, stop and recommend `brp-todo-create`.
2. Verify each task's real state rather than trusting its marker, then order the queue: broken
   foundations and blockers, security and data integrity, correctness bugs, missing validation,
   improvements, documentation, speculative ideas last. Respect declared project priorities. Give
   every remaining `[ ]` and `[~]` one disposition: execute now, blocked by a named condition,
   waiting for authority, or out of scope. "Large", "low ROI" and "future" are not terminal
   conditions.
3. Get the plan approved, then execute item by item: smallest complete production-quality change,
   tests when the risk warrants them, targeted validation before broad project checks.
4. After each item or dependency wave, record the verified result or truthful partial state in
   `TODO.md` and `TODO_LOG.md` with compact evidence, and re-read the queue before choosing the next
   item. Include the bookkeeping in the same logical change as the implementation when publication
   is authorized.
5. Delegate only independent, bounded tasks with non-overlapping file ownership. Shared state files,
   commits and pushes stay with the coordinator, which inspects the diff and validation evidence
   before accepting any result.

## Output

- Return: items verified already complete, completed this run, advanced or superseded, blockers with
  their smallest unblock action, validation commands and results including pre-existing failures,
  `TODO_LOG.md` entries added, files changed, remote or metered actions taken or still needing
  approval, and tokens spent per completed item.
- State the remaining `[ ]`, `[~]` and `[!]` counts, and for each remaining `[ ]` or `[~]` the
  concrete reason it could not be advanced. Size, elapsed time, context pressure or a preference for
  a fresh session make a task neither complete nor out of scope: report a checkpointed incomplete
  run instead.
- Load `references/todo-formats.md` for the state legend and the `TODO_LOG.md` entry shape.
