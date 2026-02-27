---
name: brp-docs
description:
  Generates documentation, specifications, and architecture decision records (ADRs). Use when
  creating or updating README files, API docs, architecture overviews, or technical specs.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Docs Skill

Generates clear, maintainable documentation from code.

## When to Use

Use `/brp-docs` when:

- Creating or updating a README
- Writing API documentation
- Documenting architecture decisions (ADRs)
- Producing technical specs or design docs
- Generating inline documentation for complex code

## Documentation Types

### README

Structure:

1. **What it is** — One-line description
2. **Quick start** — Get running in under 2 minutes
3. **Usage** — Common commands and workflows
4. **Architecture** — High-level overview (for complex projects)
5. **Contributing** — How to contribute
6. **License**

### API Documentation

For each endpoint or public function:

- **Signature** — Parameters and return type
- **Description** — What it does and when to use it
- **Examples** — At least one usage example
- **Errors** — What can go wrong

### Architecture Decision Record (ADR)

Structure:

```markdown
# ADR-NNN: [Title]

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Context

[What problem are we solving? What constraints exist?]

## Decision

[What did we decide and why?]

## Consequences

[What are the trade-offs? What does this enable or prevent?]
```

### Technical Spec

Structure:

1. **Problem statement**
2. **Goals and non-goals**
3. **Proposed solution**
4. **Alternatives considered**
5. **Implementation plan**

## Rules

- Write for the reader who has never seen this code before.
- Keep documentation close to the code it describes.
- Avoid time-sensitive references ("recently", "in the next release").
- Use consistent terminology throughout the project.
- Include runnable examples wherever possible.
