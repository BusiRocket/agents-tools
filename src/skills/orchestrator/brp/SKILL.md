---
name: brp
description:
  Main BRP orchestrator. Routes /brp-* commands, detects project stack, selects the minimal ruleset
  and skill chain, and enforces the BRP workflow protocol. Use as the entry point for all BRP
  commands.
---

## Rules

- Stack detection is deterministic, based on file presence.
- Precedence conflicts are resolved by the higher-priority level winning.
- If multiple stacks are detected, prefer the most specific match.
- See `core/policy.json` for the full routing configuration.
