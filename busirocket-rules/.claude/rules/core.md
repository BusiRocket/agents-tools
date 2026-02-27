# Core Rules

Use **@core** when you need the full set of core project rules in one go.

This rule references the following; for full detail open each:

- **Project & quality**: `.cursor/rules/core/project.mdc` — one-thing-per-file, check script
- **General**: `.cursor/rules/core/general.mdc` — agent defaults, code style, repo hygiene
- **Pattern selection**: `.cursor/rules/core/design-pattern-selection.mdc` — choose Builder/Factory/Adapter/Strategy from real pain points
- **Text hygiene**: `.cursor/rules/core/text-hygiene.mdc` — ASCII punctuation and no invisible chars in docs/config
- **JavaScript** (optional): `.cursor/rules/javascript.mdc` — cross-runtime JS/TS domain rules
- **Boundaries**: `.cursor/rules/core/boundaries.mdc` — where to put routes, components, hooks, utils, services, types
- **Naming & layout**: `.cursor/rules/core/naming-and-layout.mdc` — folder layout, file naming, exports
- **Anti-patterns**: `.cursor/rules/core/anti-patterns.mdc` — what to avoid (barrels, inline types, fat handlers)
- **Security baseline**: `.cursor/rules/core/security-baseline.mdc` — XSS/secrets/least-privilege defaults

## Short summary

- Many small files; one exported symbol per file; no inline types; no helpers inside components/hooks.
- Choose patterns by pain source: creation, structure, or behavior.
- Route handlers thin: validate → call service → return response.
- Run the project check script after meaningful changes.
- For non-JS/TS stacks, use stack rules directly (`@php`, `@rust`, `@bash`).
