---
name: brp-code-quality
description:
  Audit and harden a TypeScript or Next.js project's code-quality infrastructure including strict
  typing, linting, architectural boundaries, and runtime safety defaults. Trigger when the task is
  to bootstrap or improve repo-wide quality gates for a TypeScript or Next.js codebase and a
  `tsconfig.json` or `next.config.*` is present. Do not use for Python, Go, Rust, PHP, or any
  non-TypeScript project, isolated bug fixes, feature delivery, or behavior-preserving refactors
  inside a single module.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
paths: tsconfig.json, next.config.*
---

## Rules

- Always audit before making changes. Report findings first.
- Prefer incremental hardening over a big-bang rewrite.
- If the project uses npm or yarn instead of pnpm, adapt commands accordingly.
- If the project is not Next.js, skip Next.js-specific steps (runtime boundaries, app router
  conventions).
- The ESLint config is a template. Adapt `react.version`, path aliases, and boundary patterns to the
  actual project.
