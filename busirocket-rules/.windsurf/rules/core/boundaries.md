---
description: "Boundaries & placement rules (agent-optimized)"
alwaysApply: false
priority: high
---

# Boundaries & Placement (agent-optimized)

## Goal

Make it obvious where new code belongs so agents can create **many small files** without guessing.

## Decision Tree (Next.js App Router layout)

If you are writing...

- **A route or page** -> `app/**` (route components, layouts, route handlers)
- **Reusable UI** -> `components/<area>/...`
- **State/effects + orchestration logic** -> `hooks/<area>/useXxx.ts`
- **Pure logic** (no React, no IO) -> `utils/<area>/xxx.ts`
- **External boundary** (network/DB/auth/storage) -> `services/<area>/xxx.ts`
- **A shared shape** -> `types/<area>/Xxx.ts`

## Hard Rules

- **One exported symbol per file** (component / hook / function / type).
- **No inline types** outside `types/`.
- **No helpers inside components/hooks**; helpers go to `utils/`.
- **Route handlers must be thin**: validate input, call a `services/` function, return a response.

## References

- Next.js: `.windsurf/rules/nextjs/nextjs.mdc`
- Route handlers: `.windsurf/rules/nextjs/route-handlers.mdc`
- API response shapes: `.windsurf/rules/nextjs/api-response-shapes.mdc`
- Validation: `.windsurf/rules/api/validation.mdc`
- Naming/layout: `.windsurf/rules/core/naming-and-layout.mdc`
- utils vs services: `.windsurf/rules/backend/services-and-utils.mdc`
- Anti-patterns: `.windsurf/rules/core/anti-patterns.mdc`