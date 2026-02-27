---
name: brp
description:
  Main BRP orchestrator. Routes /brp-* commands, detects project stack, selects the minimal ruleset
  and skill chain, and enforces the BRP workflow protocol. Use as the entry point for all BRP
  commands.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# BRP Orchestrator

Routes commands, detects stack, selects rules and skills, enforces protocol.

## When to Use

The orchestrator is automatically invoked when any `/brp-*` command is used. It can also be invoked
directly with `/brp` for guided task selection.

## Commands

| Command         | Intent              | Skill Chain                      |
| --------------- | ------------------- | -------------------------------- |
| `/brp-create`   | New feature/code    | plan → implement → test → review |
| `/brp-fix`      | Bug fix             | fix → test → review              |
| `/brp-refactor` | Safe refactor       | refactor → test → review         |
| `/brp-review`   | PR/code review      | review                           |
| `/brp-test`     | Tests & validation  | test                             |
| `/brp-debug`    | Investigate issues  | debug → fix → test               |
| `/brp-migrate`  | Upgrades/migrations | plan → implement → test → review |
| `/brp-docs`     | Documentation       | docs                             |

## Orchestration Logic

### 1. Detect Stack

Search the project for stack signals:

- **Next.js**: `next.config.*`, `app/layout.*`, `next-env.d.ts`
- **React**: `vite.config.*`, `src/App.*`, react in dependencies
- **Rust**: `Cargo.toml`
- **PHP**: `composer.json`, `.php` files
- **Python**: `pyproject.toml`, `requirements.txt`
- **Go**: `go.mod`
- **Bash**: `.sh` scripts, `scripts/` directory

### 2. Select Ruleset

Apply rules by precedence (Task > Project > Stack > Global):

1. **Global** rules always apply
2. **Stack** rules for the detected stack
3. **Task** rules for the current intent
4. **Project** rules if defined in `.brp/project.json`

### 3. Select Skill Chain

1. Always include core skills for the intent (see Commands table)
2. Add stack-specific skills if relevant
3. Never inject more than 8 skills into context

### 4. Enforce Protocol

Every task follows the 6-step protocol (DISCOVERY → PLAN → IMPLEMENT → TEST → SELF-CHECK → REVIEW).
The orchestrator ensures no step is skipped.

## Rules

- Stack detection is deterministic, based on file presence.
- Precedence conflicts are resolved by the higher-priority level winning.
- If multiple stacks are detected, prefer the most specific match.
- See `core/policy.json` for the full routing configuration.
