# Next.js Rules

Use **@nextjs** when working primarily on App Router architecture and flows.

This rule references:

- **Core App Router**: `.cursor/rules/nextjs/nextjs.mdc` - RSC defaults, special-file conventions
- **Route handlers**: `.cursor/rules/nextjs/route-handlers.mdc` - thin handlers and placement
- **API responses**: `.cursor/rules/nextjs/api-response-shapes.mdc` - JSON response contracts
- **Data fetching**: `.cursor/rules/nextjs/data-fetching.mdc` - RSC-first and waterfall prevention
- **Forms/actions**: `.cursor/rules/nextjs/forms-and-actions.mdc` - Zod, RHF/next-safe-action when present
- **Performance**: `.cursor/rules/nextjs/rendering-performance.mdc` - dynamic imports, image/script strategy
- **Error/observability**: `.cursor/rules/nextjs/error-observability.mdc` - boundaries and logging

## Short summary

- RSC-first architecture with minimal client islands.
- Boundary validation + typed action/response shapes.
- Intentional caching/fetching and clear loading/error UX.
