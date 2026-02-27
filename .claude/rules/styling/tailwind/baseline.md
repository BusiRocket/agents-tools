# Tailwind Baseline

- Utility-first by default.
- Do not use `@apply` in production code (only short-lived spikes).
- Keep Tailwind as a build-time concern.
- Import Tailwind from one global stylesheet:
  - `@import 'tailwindcss';`
- Keep global stylesheet imports centralized in app/root entries.
