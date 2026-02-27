<!-- Antigravity Rule
Activation: Model Decision
Description: API layer — route handlers, validation, response shapes, services
-->

# API Rules

Use **@api** when working on route handlers, validation, or backend boundaries.

This rule references:

- **Route handlers**: `.agent/rules/nextjs/route-handlers.mdc` — thin handlers, no logic in route
- **Response shapes**: `.agent/rules/nextjs/api-response-shapes.mdc` — `{ data }` / `{ error: { code, message } }`, status codes
- **Server actions**: `.agent/rules/nextjs/server-actions.mdc` — input validation and typed action results
- **Validation**: `.agent/rules/api/validation.mdc` — validate at boundary, guard/coercion helpers in `utils/validation/`
- **Services vs utils**: `.agent/rules/backend/services-and-utils.mdc` — utils = pure; services = IO/DB/auth

## Short summary

- Handler: parse/validate input → call one service → return explicit response.
- Success: `Response.json({ data })`; error: `Response.json({ error: { code, message } }, { status })`.
- No business logic or DB access in the handler.
