---
description: "React standards (architecture, hooks, state, a11y, forms, performance)"
alwaysApply: false
priority: high
---

# React Rules

Use **@react** when working on React components, hooks, state, forms, and UI behavior.

This rule references:

- **Architecture**: `.windsurf/rules/react/react-architecture.mdc` - placement and splitting rules
- **Component patterns**: `.windsurf/rules/react/component-patterns.mdc` - component structure and boundaries
- **Hooks**: `.windsurf/rules/react/hooks-guide.mdc` - hook discipline and helper extraction
- **State**: `.windsurf/rules/react/state-management.mdc` - local vs shared state patterns
- **URL/server state**: `.windsurf/rules/react/url-server-state.mdc` - URL/query and server-state strategy
- **Accessibility**: `.windsurf/rules/react/accessibility.mdc` - semantic, keyboard, and form accessibility
- **Naming**: `.windsurf/rules/react/naming.mdc` - handler/boolean/hook naming conventions
- **Performance**: `.windsurf/rules/react/performance.mdc` - memoization and render hygiene
- **Forms/validation**: `.windsurf/rules/react/forms-validation.mdc` - Zod + RHF usage guidelines
- **Security**: `.windsurf/rules/react/security.mdc` - UI-side XSS and untrusted HTML rules
- **Testing**: `.windsurf/rules/react/testing.mdc` - opt-in React testing approach

## Short summary

- Functional components and hooks with small, focused files.
- Accessibility and predictable state handling by default.
- Validation, performance, and security rules applied pragmatically.