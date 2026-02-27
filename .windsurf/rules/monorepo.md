---
description: "Monorepo standards (Turbo workspaces, package boundaries)"
alwaysApply: false
priority: high
---

# Monorepo Rules

Use **@monorepo** when working on workspace structure, package boundaries, or Turbo pipelines.

This rule references:

- **Turbo workspaces**: `.windsurf/rules/monorepo/turbo.mdc` - boundaries, task pipelines, shared config

## Short summary

- Keep package boundaries explicit and avoid cross-app leakage.
- Centralize shared config and scripts where it reduces duplication.
- Keep Turbo tasks deterministic and cache-friendly.