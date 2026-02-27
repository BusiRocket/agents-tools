---
description: "Deploy (K8s Helm, agent guidelines)"
alwaysApply: false
priority: high
---

# Deploy Rules

Use **@deploy** when working on deployment scripts, K8s/Helm, or agent-driven deploy flows.

This rule references:

- **Sonnet/agent**: `.windsurf/rules/deploy/sonnet.mdc` — codebase search first, list rules, output discipline
- **GitHub security**: `.windsurf/rules/deploy/github-security.mdc` — secrets handling and workflow hardening

## Short summary

- Agent: search codebase first; check existing files before creating; list rules when helpful.
