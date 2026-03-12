---
name: brp-plan
description:
  Produce a decision-complete implementation plan with discovery, milestones, risks, validation, and
  acceptance criteria before code changes start. Trigger when the user asks for a plan, the scope is
  high-risk or ambiguous, or multiple implementation paths involving project structure, design
  patterns, or architecture need to be compared. Do not use for straightforward low-risk edits that
  can be implemented immediately, active debugging, or final review after code is already written.
---

## Rules

- Never skip discovery. Reading code first prevents wrong abstractions.
- Plans must include validation commands. A plan without them is incomplete.
- Prefer minimal diffs. Avoid changing files unrelated to the goal.

## Workflow

1. Read the current implementation and summarize the real starting state.
2. Define the target behavior, explicit non-goals, and major constraints.
3. Break the work into ordered milestones with concrete implementation intent.
4. Call out risks, migrations, compatibility constraints, and failure modes.
5. End with validation commands and acceptance criteria that make the work executable.

## Output

- Return: discovery summary, implementation plan, interface changes, validation commands,
  assumptions.
- Load `references/decision-complete-plan-template.md` to keep plan structure and acceptance
  criteria consistent.
