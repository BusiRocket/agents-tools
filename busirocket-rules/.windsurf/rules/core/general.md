---
description: "General Engineering Guidelines (agent-optimized)"
alwaysApply: true
priority: high
---

# General Engineering Guidelines

## Core Goal

Optimize for agent context by keeping **many small, focused files** and explicit boundaries.

## Scope Priority

- Primary by default: TypeScript, React, Next.js App Router, Tailwind.
- Secondary only when relevant in the repo: Zod, React Hook Form, Zustand, TanStack Query, `nuqs`, `next-safe-action`, Supabase, GraphQL tooling, Vercel AI SDK.
- Out of scope unless explicitly requested: React Native/Expo, Vue/Nuxt/Gatsby/SvelteKit, NestJS, Chrome Extensions, Pixi.js, Prisma.
- For other languages, use their stack rules:
  - PHP: `@php`
  - Rust/Tauri: `@rust`
  - Go: `@go`
  - Monorepo/Turbo: `@monorepo`
  - Bash/Shell: `@bash`

## Agent Defaults

- Prefer small, safe changes over sweeping refactors unless requested.
- When requirements are ambiguous, ask a clarifying question before coding.
- Dependencies policy:
- First, check if an existing dependency in the repo already solves the problem (UI, icons, dates, validation, data access, etc.).
- If existing dependencies are insufficient, research and suggest the best-fit library with brief tradeoffs.
- Prefer mature libraries over building complex systems in-house (dates, advanced UI, rich text, DB/ORM, complex state/query layers).
- Keep changes reversible; avoid touching unrelated files.
- Use subagents to process multiple files in parallel when the task involves several independent edits.
- Plan before executing: create a short plan before modifying code; ask if scope is unclear.
- After meaningful changes: briefly reflect on maintainability and scalability; suggest improvements if needed.

## Code Style

- English-only code, comments, and identifiers.
- Prefer SOLID and KISS where applicable.
- Prefer pure functions and hooks; avoid unnecessary classes.
- Avoid deep nesting; extract early.
- Prefer guard clauses and early returns to reduce nesting.
- Avoid magic numbers; name them as constants.

## Priorities

- Correctness > clarity > maintainability > performance.

## Repo Hygiene

- No index/barrel files.
- One responsibility per file.
- Keep route handlers thin; move logic to `services/`.

## Network / API

- Implement proper error handling for network requests and responses; surface user-friendly errors when possible.
- Consider API versioning and CORS when designing or integrating with backends.
- For external backends: consider retries for transient failures and appropriate serialization for complex payloads.

## Quality Gate

- Always run the project's check script after meaningful changes (e.g. `pnpm run check`, `npm run check`).
