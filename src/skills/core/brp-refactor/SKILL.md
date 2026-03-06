---
name: brp-refactor
description:
  Safe refactoring workflow with quality gates. Use when you need to split large files into
  components/hooks/types, extract inline helpers, and refactor existing code without changing
  behavior.
---

## Rules

- **Never mix refactoring with feature changes.** These are separate tasks.
- **Tests must pass at every step.** If they don't, the refactor is wrong.
- **Preserve public interfaces.** Callers should not need to change.
- Run the full test suite before and after, and compare results.
