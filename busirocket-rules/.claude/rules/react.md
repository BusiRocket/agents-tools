# React Rules

Use **@react** when working on React components, hooks, state, forms, and UI behavior.

This rule references:

- **Architecture**: `.cursor/rules/react/react-architecture.mdc` - placement and splitting rules
- **Component patterns**: `.cursor/rules/react/component-patterns.mdc` - component structure and boundaries
- **Hooks**: `.cursor/rules/react/hooks-guide.mdc` - hook discipline and helper extraction
- **State**: `.cursor/rules/react/state-management.mdc` - local vs shared state patterns
- **URL/server state**: `.cursor/rules/react/url-server-state.mdc` - URL/query and server-state strategy
- **Accessibility**: `.cursor/rules/react/accessibility.mdc` - semantic, keyboard, and form accessibility
- **Naming**: `.cursor/rules/react/naming.mdc` - handler/boolean/hook naming conventions
- **Performance**: `.cursor/rules/react/performance.mdc` - memoization and render hygiene
- **Forms/validation**: `.cursor/rules/react/forms-validation.mdc` - Zod + RHF usage guidelines
- **Security**: `.cursor/rules/react/security.mdc` - UI-side XSS and untrusted HTML rules
- **Testing**: `.cursor/rules/react/testing.mdc` - opt-in React testing approach

## Short summary

- Functional components and hooks with small, focused files.
- Accessibility and predictable state handling by default.
- Validation, performance, and security rules applied pragmatically.
