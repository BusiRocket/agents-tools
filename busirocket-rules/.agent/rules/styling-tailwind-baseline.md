<!-- Antigravity Rule
Activation: Model Decision
Description: Tailwind v4 baseline defaults (utility-first, setup, no apply in production)
-->

# Tailwind Baseline

- Utility-first by default.
- Do not use `@apply` in production code (only short-lived spikes).
- Keep Tailwind as a build-time concern.
- Import Tailwind from one global stylesheet:
  - `@import 'tailwindcss';`
- Keep global stylesheet imports centralized in app/root entries.
