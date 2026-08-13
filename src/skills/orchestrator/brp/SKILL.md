---
name: brp
description:
  Routes BRP requests to the right workflow by detecting project context, selecting the minimal rule
  set for monorepo, Next.js, and TypeScript contexts, and choosing the correct BRP skill chain
  before work starts. Trigger when the task needs BRP command routing, protocol enforcement, or
  workflow selection across planning, implementation, testing, and review. Do not use for
  stack-specific coding guidance, single-purpose workflows that already have a precise BRP skill, or
  direct code generation without orchestration.
user-invocable: false
allowed-tools: Read, Grep, Glob
---

## Rules

- Stack detection is deterministic, based on file presence.
- Precedence conflicts are resolved by the higher-priority level winning.
- If multiple stacks are detected, prefer the most specific match.
- Deterministic prompt routing is done by the UserPromptSubmit hook
  (`src/hooks/utils/route_prompt.py`): regex lanes emit an explicit skill directive before the model
  reasons about the prompt, and stay silent when nothing matches.
- The per-skill rule sets are mapped at build time in `src/skills/skill-rules.map.json`.

## Intent-to-skill chains

- New feature or ambiguous scope: `brp-plan` -> `brp-implement` -> `brp-test` -> `brp-review`.
- Known bug with a narrow cause: `brp-fix`. Unclear cause: `brp-debug` first, then `brp-fix`.
- Structural change with no behavior change: `brp-refactor`.
- Docs, specs, or ADRs: `brp-docs`. Shipping a version: `brp-release`.
- Repo-wide quality gates: `brp-code-quality` (TypeScript/Next.js) or `brp-rust-quality` (Rust).
- Backlog work: `brp-todo-create` builds it, `brp-todo-work` executes it.
