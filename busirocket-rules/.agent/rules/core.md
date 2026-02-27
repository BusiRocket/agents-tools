<!-- Antigravity Rule
Activation: Model Decision
Description: Core project rules (file discipline, boundaries, naming, anti-patterns)
-->

# Core Rules

Use **@core** when you need the full set of core project rules in one go.

This rule references the following; for full detail open each:

- **Project & quality**: `.agent/rules/core/project.mdc` — one-thing-per-file, check script
- **General**: `.agent/rules/core/general.mdc` — agent defaults, code style, repo hygiene
- **Pattern selection**: `.agent/rules/core/design-pattern-selection.mdc` — choose Builder/Factory/Adapter/Strategy from real pain points
- **Text hygiene**: `.agent/rules/core/text-hygiene.mdc` — ASCII punctuation and no invisible chars in docs/config
- **JavaScript** (optional): `.agent/rules/javascript.mdc` — cross-runtime JS/TS domain rules
- **Boundaries**: `.agent/rules/core/boundaries.mdc` — where to put routes, components, hooks, utils, services, types
- **Naming & layout**: `.agent/rules/core/naming-and-layout.mdc` — folder layout, file naming, exports
- **Anti-patterns**: `.agent/rules/core/anti-patterns.mdc` — what to avoid (barrels, inline types, fat handlers)
- **Security baseline**: `.agent/rules/core/security-baseline.mdc` — XSS/secrets/least-privilege defaults

## Short summary

- Many small files; one exported symbol per file; no inline types; no helpers inside components/hooks.
- Choose patterns by pain source: creation, structure, or behavior.
- Route handlers thin: validate → call service → return response.
- Run the project check script after meaningful changes.
- For non-JS/TS stacks, use stack rules directly (`@php`, `@rust`, `@bash`).
