---
description: "API layer — route handlers, validation, response shapes, services"
alwaysApply: false
priority: high
---

# API Rules

Use **@api** when working on route handlers, validation, or backend boundaries.

This rule references:

- **Route handlers**: `.windsurf/rules/nextjs/route-handlers.mdc` — thin handlers, no logic in route
- **Response shapes**: `.windsurf/rules/nextjs/api-response-shapes.mdc` — `{ data }` / `{ error: { code, message } }`, status codes
- **Server actions**: `.windsurf/rules/nextjs/server-actions.mdc` — input validation and typed action results
- **Validation**: `.windsurf/rules/api/validation.mdc` — validate at boundary, guard/coercion helpers in `utils/validation/`
- **Services vs utils**: `.windsurf/rules/backend/services-and-utils.mdc` — utils = pure; services = IO/DB/auth

## Short summary

- Handler: parse/validate input → call one service → return explicit response.
- Success: `Response.json({ data })`; error: `Response.json({ error: { code, message } }, { status })`.
- No business logic or DB access in the handler.
