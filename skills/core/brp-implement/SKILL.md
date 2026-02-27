---
name: brp-implement
description:
  Guides incremental implementation following a plan. Enforces minimal diffs, one logical change per
  step, and convention adherence. Use after brp-plan to execute the approved plan.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Implement Skill

Executes the plan produced by `brp-plan` with incremental, safe changes.

## When to Use

Use `/brp-implement` after a plan has been produced and approved. This skill enforces disciplined
execution.

## Workflow

### Prerequisites

- A completed plan from `brp-plan` (or equivalent structured plan)
- Clear milestones and acceptance criteria

### Execution Rules

1. **Follow the plan** — Execute milestones in order. Deviate only with a documented reason.
2. **Minimal diffs** — Change only what the plan specifies. Avoid "while I'm here" improvements.
3. **One logical change per step** — Each milestone should be a self-contained change.
4. **Respect conventions** — Use existing naming, structure, and boundary patterns.
5. **No new dependencies** — Unless justified and stated in the plan.

### Implementation Checklist

For each file created or modified:

- [ ] Follows single-responsibility principle
- [ ] One exported symbol per file
- [ ] No inline types (types in `types/<area>/`)
- [ ] No helper functions inside components/hooks
- [ ] File size within limits (10–100 lines target)
- [ ] No barrel/index files

### After Implementation

- Run the validation commands from the plan
- If tests fail, fix before proceeding
- Document any deviations from the plan

## Rules

- Stop implementing if you discover the plan is wrong. Go back to `brp-plan`.
- Never introduce TODO or placeholder code in delivered output.
- If a change grows beyond the plan's scope, split into a separate task.
