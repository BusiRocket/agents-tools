---
name: brp-implement
description:
  Guides incremental implementation following a plan. Enforces minimal diffs, one logical change per
  step, and convention adherence. Use after brp-plan to execute the approved plan.
---

## Rules

- Stop implementing if you discover the plan is wrong. Go back to `brp-plan`.
- Never introduce TODO or placeholder code in delivered output.
- If a change grows beyond the plan's scope, split into a separate task.
