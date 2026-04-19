---
name: brp-refactor
description:
  Refactor existing code into cleaner structure without changing behavior by splitting files,
  extracting helpers, and preserving public interfaces with tight validation. Trigger when the goal
  is structural improvement with no feature change. Do not use for shipping new behavior, fixing
  unknown bugs, or final quality review of already-finished work.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, TodoWrite
---

## Rules

- **Never mix refactoring with feature changes.** These are separate tasks.
- **Tests must pass at every step.** If they don't, the refactor is wrong.
- **Preserve public interfaces.** Callers should not need to change.
- Run the full test suite before and after, and compare results.
