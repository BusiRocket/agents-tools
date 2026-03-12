---
name: brp-implement
description:
  Execute an approved implementation plan through small, verifiable code changes that preserve scope
  and project conventions. Trigger when the approach is already decided and the task is to write the
  code incrementally with validation along the way. Do not use for ambiguous discovery work,
  root-cause debugging, or final review after implementation is complete.
---

## Rules

- Stop implementing if you discover the plan is wrong. Go back to `brp-plan`.
- Never introduce TODO or placeholder code in delivered output.
- If a change grows beyond the plan's scope, split into a separate task.
