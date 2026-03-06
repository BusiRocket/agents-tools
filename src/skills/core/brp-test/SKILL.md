---
name: brp-test
description:
  Generates or updates tests and provides validation commands. Covers unit, integration, and manual
  verification strategies. Use after implementation to ensure correctness.
---

## Rules

- Every implementation MUST have validation commands, even if no test framework exists.
- If no test framework is available, provide manual verification steps.
- Tests must be independent and deterministic.
- Prefer testing behavior over implementation details.
