---
name: brp-fix
description:
  Structured bugfix workflow. Reproduce the bug, form a hypothesis, apply a minimal fix, and verify.
  Use when fixing reported bugs or unexpected behavior.
---

## Rules

- Never fix without reproducing first. "I think this should fix it" is not enough.
- Minimal diff only. Bug fixes are not the time for refactoring.
- Always add a test for the case that was broken.
