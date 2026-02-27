---
description: "Next.js App Router standards (routing, data, actions, performance)"
alwaysApply: false
priority: high
---

# Next.js Rules

Use **@nextjs** when working primarily on App Router architecture and flows.

This rule references:

- **Core App Router**: `.windsurf/rules/nextjs/nextjs.mdc` - RSC defaults, special-file conventions
- **Route handlers**: `.windsurf/rules/nextjs/route-handlers.mdc` - thin handlers and placement
- **API responses**: `.windsurf/rules/nextjs/api-response-shapes.mdc` - JSON response contracts
- **Data fetching**: `.windsurf/rules/nextjs/data-fetching.mdc` - RSC-first and waterfall prevention
- **Forms/actions**: `.windsurf/rules/nextjs/forms-and-actions.mdc` - Zod, RHF/next-safe-action when present
- **Performance**: `.windsurf/rules/nextjs/rendering-performance.mdc` - dynamic imports, image/script strategy
- **Error/observability**: `.windsurf/rules/nextjs/error-observability.mdc` - boundaries and logging

## Short summary

- RSC-first architecture with minimal client islands.
- Boundary validation + typed action/response shapes.
- Intentional caching/fetching and clear loading/error UX.