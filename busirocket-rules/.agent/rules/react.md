<!-- Antigravity Rule
Activation: Model Decision
Description: React standards (architecture, hooks, state, a11y, forms, performance)
-->

# React Rules

Use **@react** when working on React components, hooks, state, forms, and UI behavior.

This rule references:

- **Architecture**: `.agent/rules/react/react-architecture.mdc` - placement and splitting rules
- **Component patterns**: `.agent/rules/react/component-patterns.mdc` - component structure and boundaries
- **Hooks**: `.agent/rules/react/hooks-guide.mdc` - hook discipline and helper extraction
- **State**: `.agent/rules/react/state-management.mdc` - local vs shared state patterns
- **URL/server state**: `.agent/rules/react/url-server-state.mdc` - URL/query and server-state strategy
- **Accessibility**: `.agent/rules/react/accessibility.mdc` - semantic, keyboard, and form accessibility
- **Naming**: `.agent/rules/react/naming.mdc` - handler/boolean/hook naming conventions
- **Performance**: `.agent/rules/react/performance.mdc` - memoization and render hygiene
- **Forms/validation**: `.agent/rules/react/forms-validation.mdc` - Zod + RHF usage guidelines
- **Security**: `.agent/rules/react/security.mdc` - UI-side XSS and untrusted HTML rules
- **Testing**: `.agent/rules/react/testing.mdc` - opt-in React testing approach

## Short summary

- Functional components and hooks with small, focused files.
- Accessibility and predictable state handling by default.
- Validation, performance, and security rules applied pragmatically.
