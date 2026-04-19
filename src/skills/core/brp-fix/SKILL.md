---
name: brp-fix
description:
  Reproduce and patch a known bug with a minimal diff, then verify the broken behavior stays fixed.
  Trigger when the task is to implement a concrete bug fix and the likely cause is already narrow
  enough to change code safely while preserving code quality and useful observability signals. Do
  not use for open-ended root-cause investigations, behavior-preserving refactors, or broad
  code-quality audits.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, TodoWrite
---

## Rules

- Never fix without reproducing first. "I think this should fix it" is not enough.
- Minimal diff only. Bug fixes are not the time for refactoring.
- Always add a test for the case that was broken.

## Workflow

1. Reproduce the failure or establish a trusted failing signal.
2. Confirm the smallest code path that explains the broken behavior.
3. Apply the narrowest fix that restores the expected behavior.
4. Add or update tests so the regression is guarded permanently.
5. Re-run verification and record any residual risk.

## Output

- Return: reproduction, fix summary, tests added or updated, verification commands, residual risk.
- Load `references/bug-reproduction-template.md` when the bug report is incomplete or ambiguous.
