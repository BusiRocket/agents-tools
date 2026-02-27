<!-- Antigravity Rule
Activation: Model Decision
Description: React testing strategy (opt-in, risk-based)
-->

# React Testing

## When to test

- Tests are opt-in unless explicitly requested or the change is high-risk.

## Baseline stack

- Unit/component tests: Jest + React Testing Library.
- E2E tests for critical flows: Playwright.

## Test style

- Follow Arrange-Act-Assert.
- Prefer behavior-focused tests over implementation-detail tests.
- Use deterministic setup/teardown; avoid fragile timing assumptions.