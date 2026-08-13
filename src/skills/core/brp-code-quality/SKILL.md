---
name: brp-code-quality
description:
  Audits and hardens a TypeScript or Next.js project's code-quality infrastructure including strict
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
- Write the ESLint flat config from the loaded quality rules (code-quality guidelines, import
  hygiene, boundaries), adapting `react.version`, path aliases, and boundary patterns to the actual
  project rather than pasting a fixed config.

## Workflow

1. Detect the stack: package manager, TypeScript config, framework, existing lint and CI gates.
2. Audit strictness flags, lint coverage, boundary enforcement, and runtime safety; report findings
   first.
3. Apply the smallest hardening steps, gated by the project's check script after each one.
4. Re-run the checks and report what changed, what is left, and any residual risk.

## Output

- Return: findings from the audit, hardening steps applied, check results, and the remaining gaps
  with their risk.
