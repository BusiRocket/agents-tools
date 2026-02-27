<!-- Antigravity Rule
Activation: Model Decision
Description: Next.js App Router standards (routing, data, actions, performance)
-->

# Next.js Rules

Use **@nextjs** when working primarily on App Router architecture and flows.

This rule references:

- **Core App Router**: `.agent/rules/nextjs/nextjs.mdc` - RSC defaults, special-file conventions
- **Route handlers**: `.agent/rules/nextjs/route-handlers.mdc` - thin handlers and placement
- **API responses**: `.agent/rules/nextjs/api-response-shapes.mdc` - JSON response contracts
- **Data fetching**: `.agent/rules/nextjs/data-fetching.mdc` - RSC-first and waterfall prevention
- **Forms/actions**: `.agent/rules/nextjs/forms-and-actions.mdc` - Zod, RHF/next-safe-action when present
- **Performance**: `.agent/rules/nextjs/rendering-performance.mdc` - dynamic imports, image/script strategy
- **Error/observability**: `.agent/rules/nextjs/error-observability.mdc` - boundaries and logging

## Short summary

- RSC-first architecture with minimal client islands.
- Boundary validation + typed action/response shapes.
- Intentional caching/fetching and clear loading/error UX.