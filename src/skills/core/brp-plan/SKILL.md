---
name: brp-plan
description:
  Enforces structured planning before implementation. Produces a discovery summary, 5-10 bullet plan
  with milestones, risk analysis, and acceptance criteria. Use before any create, fix, refactor, or
  migrate task.
---

## Rules

- Never skip discovery. Reading code first prevents wrong abstractions.
- Plans must include validation commands. A plan without them is incomplete.
- Prefer minimal diffs. Avoid changing files unrelated to the goal.
