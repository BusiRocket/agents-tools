---
name: brp-plan
description:
  Enforces structured planning before implementation. Produces a discovery summary, 5-10 bullet plan
  with milestones, risk analysis, and acceptance criteria. Use before any create, fix, refactor, or
  migrate task.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Plan Skill

Produces a structured plan following the BRP protocol before any code changes.

## When to Use

Use `/brp-plan` at the start of every non-trivial task: feature creation, bugfixes, refactors,
migrations, or any work that touches more than one file.

## Workflow

### Step 1: DISCOVERY

Before planning, read the existing code:

1. Identify affected files and their current responsibilities
2. Map dependencies that could be impacted
3. Note existing patterns (naming, structure, testing)
4. Check for related tests, docs, or configs

### Step 2: Produce the Plan

Output a structured plan with these sections:

**Goal** — One sentence describing what this task accomplishes.

**Files to change** — List each file with action (create/modify/delete) and why.

**Milestones** (5–10 bullets):

- Each bullet is a concrete, verifiable step
- Order by dependency (build foundations first)
- Include test updates alongside implementation

**Risks and edge cases**:

- What could break?
- What assumptions are we making?
- Are there performance or security implications?

**Acceptance criteria**:

- How do we know this is done?
- What commands validate success?

**Minimal diff strategy** — Prefer the smallest set of changes that achieves the goal.

## Output Format

```markdown
## Plan: [Goal]

### Discovery

[Summary of existing code, patterns, dependencies]

### Milestones

1. [First concrete step]
2. [Second step] ...

### Risks

- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

### Acceptance Criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]

### Validation Commands

- `[command 1]`
- `[command 2]`
```

## Rules

- Never skip discovery. Reading code first prevents wrong abstractions.
- Plans must include validation commands. A plan without them is incomplete.
- Prefer minimal diffs. Avoid changing files unrelated to the goal.
