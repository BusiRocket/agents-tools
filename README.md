# busirocket-agents-tools (BRP)

Agent workflow engine + rules/skills orchestrator that enforces planning, testing, and review to
consistently produce high-quality code across IDEs.

## What It Is

BRP consolidates rules, skills, and an orchestration protocol into a single project that works as:

- A **Claude Code plugin** (`claude --plugin-dir .`)
- A **Cursor rules source** (compiled via `pnpm rules:compile`)
- A **multi-IDE exporter** (Claude, Codex, Antigravity/Gemini, Windsurf)
- An **AgentSkills-compatible** skill collection

## Quick Start

```bash
# Clone and install
git clone https://github.com/BusiRocket/busirocket-agents-tools.git
cd busirocket-agents-tools
pnpm install

# Compile rules for all IDEs
pnpm rules:compile

# Link rules globally (optional)
pnpm rules:link:all
```

### As a Claude Code Plugin

```bash
claude --plugin-dir /path/to/busirocket-agents-tools
# Then use: /busirocket-agents-tools:brp-plan
```

## Commands

| Command         | What it does                                           |
| --------------- | ------------------------------------------------------ |
| `/brp-create`   | Plan → Implement → Test → Review                       |
| `/brp-fix`      | Reproduce → Hypothesize → Fix → Verify                 |
| `/brp-refactor` | Assess → Plan → Execute → Quality check                |
| `/brp-review`   | Self-check + PR review (security/perf/maintainability) |
| `/brp-test`     | Generate tests + validation commands                   |
| `/brp-debug`    | Symptoms → Hypotheses → Isolation → Resolution         |
| `/brp-migrate`  | Plan → Implement → Test → Review (for upgrades)        |
| `/brp-docs`     | README, API docs, ADRs, specs                          |

## Workflow Protocol (Non-Negotiable)

Every task follows 6 steps:

1. **DISCOVERY** — Read existing code before creating abstractions
2. **PLAN** — 5–10 bullets with milestones + risks
3. **IMPLEMENT** — Minimal diffs, incremental changes
4. **TEST** — Tests + validation commands
5. **SELF-CHECK** — Final checklist
6. **REVIEW** — Security, performance, maintainability

> If plan or validation commands are missing, the output is **incomplete**.

## Project Structure

```
busirocket-agents-tools/
├── .claude-plugin/          # Claude Code plugin manifest
│   └── plugin.json
├── core/
│   ├── protocol.md          # 6-step workflow contract
│   └── policy.json          # Routing, precedence, stack detection
├── rules/
│   └── source/              # Canonical rules (.mdc, IDE-agnostic)
│       ├── core/            # Code quality, boundaries, naming
│       ├── react/           # React patterns
│       ├── nextjs/          # Next.js App Router
│       ├── rust/            # Rust standards
│       └── ...              # php, python, bash, go, etc.
├── skills/
│   ├── core/                # 8 BRP workflow skills
│   │   ├── brp-plan/
│   │   ├── brp-implement/
│   │   ├── brp-test/
│   │   ├── brp-review/
│   │   ├── brp-fix/
│   │   ├── brp-refactor/
│   │   ├── brp-debug/
│   │   └── brp-docs/
│   ├── stacks/              # Stack-specific skills
│   │   ├── busirocket-core-conventions/
│   │   ├── busirocket-react/
│   │   ├── busirocket-nextjs/
│   │   └── ...
│   └── orchestrator/        # Command router
│       └── brp/
├── scripts/                 # Build, lint, compile, validate
│   ├── compile-rules.mjs
│   ├── validate-skills.mjs
│   └── lib/
└── docs/
    ├── architecture.md
    └── ide-setup.md
```

## Rule Precedence

```
Task > Project > Stack > Global
```

- **Global**: Personal invariants (few lines)
- **Stack**: Next.js, React, Rust, PHP, Bash, etc.
- **Project**: Repo-specific overrides
- **Task**: create, fix, refactor, review, debug, migrate

## IDE Exports

```bash
# Compile canonical rules → IDE-specific formats
pnpm rules:compile

# Link to specific IDEs globally
pnpm rules:link:codex
pnpm rules:link:claude
pnpm rules:link:antigravity
pnpm rules:link:windsurf
pnpm rules:link:all
```

Generated files: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `WINDSURF.md`, `.cursor/rules/`,
`.claude/rules/`, `.agent/rules/`, `.windsurf/rules/`.

## Scripts

| Script                 | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `pnpm build`           | Full pipeline (format + lint + compile + validate) |
| `pnpm check`           | CI-friendly check-all                              |
| `pnpm rules:compile`   | Compile canonical rules for all IDEs               |
| `pnpm rules:check`     | Verify compiled output is current                  |
| `pnpm skills:validate` | Validate skills with AgentSkills spec              |
| `pnpm skills:llms`     | Generate `llms.txt` for skill discovery            |
| `pnpm format`          | Format all files with Prettier                     |
| `pnpm lint`            | ESLint check                                       |

## Roadmap

- **Phase 1 (MVP)** ✅ — Orchestrator, 8 core skills, canonical rules, IDE exports, Claude Code
  plugin
- **Phase 2** — Registry: index 8000+ skills, allowlists per stack, scoring
- **Phase 3** — Auto-evolution: success/failure tracking, allowlist reordering

## License

MIT
