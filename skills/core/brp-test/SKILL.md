---
name: brp-test
description:
  Generates or updates tests and provides validation commands. Covers unit, integration, and manual
  verification strategies. Use after implementation to ensure correctness.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Test Skill

Ensures every implementation is backed by tests and validation commands.

## When to Use

Use `/brp-test` after implementing changes, or standalone to add test coverage to existing code.

## Workflow

### Step 1: Identify what to test

- New functions, components, or services
- Modified behavior (regression tests)
- Edge cases identified during planning
- Error paths and boundary conditions

### Step 2: Choose testing strategy

Based on the stack, provide appropriate tests:

| Stack   | Framework             | Command                 |
| ------- | --------------------- | ----------------------- |
| Node/TS | Vitest or Jest        | `pnpm test`             |
| React   | React Testing Library | `pnpm test`             |
| Next.js | Vitest + Playwright   | `pnpm test && pnpm e2e` |
| Rust    | Built-in              | `cargo test`            |
| PHP     | PHPUnit or Pest       | `composer test`         |
| Python  | pytest                | `pytest`                |
| Go      | Built-in              | `go test ./...`         |

### Step 3: Write tests

For each testable unit, provide:

1. **Happy path** — The expected behavior works
2. **Edge cases** — Boundary values, empty inputs, nulls
3. **Error cases** — Invalid input, network failures, permissions

### Step 4: Provide validation commands

Always include explicit commands the developer can run:

```bash
# Unit tests
pnpm test

# Type checking
pnpm tsc --noEmit

# Lint
pnpm lint

# Full validation
pnpm check
```

## Rules

- Every implementation MUST have validation commands, even if no test framework exists.
- If no test framework is available, provide manual verification steps.
- Tests must be independent and deterministic.
- Prefer testing behavior over implementation details.
