# Go Rules

Use **@go** when working on Go codebases.

This rule references:

- **Go microservices**: `.cursor/rules/go/microservices.mdc` - clean architecture, interfaces, observability, resilience, testing

## Short summary

- Keep handlers thin and domain logic isolated.
- Depend on interfaces, use explicit DI, avoid global mutable state.
- Enforce context propagation, explicit error handling, and observability.
