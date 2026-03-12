---
name: brp
description:
  Route BRP requests to the right workflow by detecting project context, selecting the minimal rule
  set for monorepo, Next.js, and TypeScript contexts, and choosing the correct BRP skill chain
  before work starts. Trigger when the task needs BRP command routing, protocol enforcement, or
  workflow selection across planning, implementation, testing, and review. Do not use for
  stack-specific coding guidance, single-purpose workflows that already have a precise BRP skill, or
  direct code generation without orchestration.
---

## Rules

- Stack detection is deterministic, based on file presence.
- Precedence conflicts are resolved by the higher-priority level winning.
- If multiple stacks are detected, prefer the most specific match.
- See `core/policy.json` for the full routing configuration.
