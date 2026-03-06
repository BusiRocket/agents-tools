---
name: brp-code-quality
description:
  Audits and hardens a project's code-quality infrastructure. Covers TypeScript strict mode, ESLint
  flat config with typed linting, import hygiene, architecture boundaries, and runtime boundary
  safety. Use to bootstrap or audit any TypeScript/Next.js project.
---

## Rules

- Always audit before making changes. Report findings first.
- Prefer incremental hardening over a big-bang rewrite.
- If the project uses npm or yarn instead of pnpm, adapt commands accordingly.
- If the project is not Next.js, skip Next.js-specific steps (runtime boundaries, app router
  conventions).
- The ESLint config is a template. Adapt `react.version`, path aliases, and boundary patterns to the
  actual project.
