# busirocket-agents-tools (BRP)

Agent workflow engine + rules/skills orchestrator that enforces planning, testing, and review to
consistently produce high-quality code across IDEs.

## What It Is

BRP consolidates rules, skills, and an orchestration protocol into a single project that works as:

- A **Cursor plugin** (`dist/plugins/cursor/.cursor-plugin/plugin.json`)
- A **Claude Code plugin** (`dist/plugins/claude/.claude-plugin/plugin.json`)
- A **multi-IDE rules exporter** (Cursor, Claude, Codex, Antigravity/Gemini, Windsurf)
- An **AgentSkills-compatible** skill collection (19 validated skills)

## Quick Start

```bash
# Clone and run full setup (install, build, check, link rules + skills to IDEs)
git clone https://github.com/BusiRocket/busirocket-agents-tools.git
cd busirocket-agents-tools
pnpm run setup
```

To update dependencies and refresh everything: `pnpm run update`.

### As a Cursor Plugin

Install from the plugin directory or point Cursor to `dist/plugins/cursor/`.

### As a Claude Code Plugin

```bash
claude --plugin-dir /path/to/busirocket-agents-tools
# Then use: /brp-plan, /brp-fix, etc.
```

## Workflow Commands

| Command          | What it does                                           |
| ---------------- | ------------------------------------------------------ |
| `/brp-plan`      | Plan → Define milestones → Risk assessment             |
| `/brp-implement` | Minimal diffs → Incremental changes                    |
| `/brp-fix`       | Reproduce → Hypothesize → Fix → Verify                 |
| `/brp-refactor`  | Assess → Plan → Execute → Quality check                |
| `/brp-review`    | Self-check + PR review (security/perf/maintainability) |
| `/brp-test`      | Generate tests + validation commands                   |
| `/brp-debug`     | Symptoms → Hypotheses → Isolation → Resolution         |
| `/brp-docs`      | README, API docs, ADRs, specs                          |

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
├── src/                         # Source (canonical content)
│   ├── rules/                   # Canonical rules (.mdc, IDE-agnostic)
│   │   ├── core/                # Code quality, boundaries, naming
│   │   ├── react/               # React patterns
│   │   ├── nextjs/              # Next.js App Router
│   │   ├── rust/                # Rust standards
│   │   ├── typescript/          # TypeScript conventions
│   │   ├── php/                 # PHP / Laravel / WordPress
│   │   ├── python/              # Python / Django
│   │   ├── go/                  # Go microservices
│   │   ├── bash/                # Shell scripting
│   │   ├── styling/             # Tailwind, Bootstrap
│   │   ├── deploy/              # CI/CD, security
│   │   ├── integrations/        # Supabase, Stripe, n8n, etc.
│   │   └── ...
│   ├── skills/                  # Agent skills
│   │   ├── core/                # 8 BRP workflow skills
│   │   │   ├── brp-plan/
│   │   │   ├── brp-implement/
│   │   │   ├── brp-test/
│   │   │   ├── brp-review/
│   │   │   ├── brp-fix/
│   │   │   ├── brp-refactor/
│   │   │   ├── brp-debug/
│   │   │   └── brp-docs/
│   │   ├── stacks/              # Stack-specific skills (10)
│   │   │   ├── busirocket-core-conventions/
│   │   │   ├── busirocket-react/
│   │   │   ├── busirocket-nextjs/
│   │   │   ├── busirocket-typescript-standards/
│   │   │   ├── busirocket-tailwind/
│   │   │   ├── busirocket-rust/
│   │   │   ├── busirocket-tauri/
│   │   │   ├── busirocket-supabase/
│   │   │   ├── busirocket-refactor-workflow/
│   │   │   └── busirocket-validation/
│   │   └── orchestrator/        # Command router
│   │       └── brp/
│   └── core/                    # Protocol & policy
│       ├── protocol.md          # 6-step workflow contract
│       └── policy.json          # Routing, precedence, stack detection
│
├── dist/                        # Compiled output (generated, gitignored)
│   ├── global/                  # Per-IDE compiled rules
│   │   ├── .cursor/rules/
│   │   ├── .claude/rules/
│   │   ├── .agent/rules/        # Antigravity (Gemini)
│   │   ├── .windsurf/rules/
│   │   └── codex/
│   ├── markdown/                # Monolithic markdown exports
│   │   ├── CLAUDE.md
│   │   ├── AGENTS.md
│   │   ├── GEMINI.md
│   │   └── WINDSURF.md
│   └── plugins/                 # Plugin manifests
│       ├── cursor/.cursor-plugin/plugin.json
│       └── claude/.claude-plugin/plugin.json
│
├── scripts/                     # Build, lint, compile, validate
├── docs/                        # Project documentation
│   ├── architecture.md
│   └── ide-setup.md
└── package.json
```

## Skills (19 validated)

### Core Workflow Skills (8)

| Skill           | Purpose                                             |
| --------------- | --------------------------------------------------- |
| `brp-plan`      | Structured planning with milestones and risks       |
| `brp-implement` | Incremental implementation with minimal diffs       |
| `brp-fix`       | Bug reproduction, hypothesis, fix, verification     |
| `brp-refactor`  | Code assessment, planning, execution, quality check |
| `brp-review`    | Security, performance, maintainability review       |
| `brp-test`      | Test generation and validation                      |
| `brp-debug`     | Symptom analysis, hypothesis, isolation, resolution |
| `brp-docs`      | Documentation generation (README, API, ADR)         |

### Stack Skills (10)

| Skill                             | Coverage                                        |
| --------------------------------- | ----------------------------------------------- |
| `busirocket-core-conventions`     | Code quality, boundaries, naming, anti-patterns |
| `busirocket-react`                | React patterns, hooks, Zustand, accessibility   |
| `busirocket-nextjs`               | App Router, caching, route handlers, validation |
| `busirocket-typescript-standards` | Types, strictness, one-thing-per-file           |
| `busirocket-tailwind`             | Tailwind setup, class strategy, ordering        |
| `busirocket-rust`                 | Rust boundaries, modules, validation            |
| `busirocket-tauri`                | Tauri commands, project structure               |
| `busirocket-supabase`             | Supabase access rule, service usage             |
| `busirocket-refactor-workflow`    | File refactoring workflow, split heuristics     |
| `busirocket-validation`           | Validation boundaries, Zod, guard helpers       |

### Orchestrator (1)

| Skill | Purpose                                       |
| ----- | --------------------------------------------- |
| `brp` | Routes commands to the appropriate core skill |

## Rule Categories

| Category       | Topics                                                       |
| -------------- | ------------------------------------------------------------ |
| `core`         | Code quality, boundaries, naming, anti-patterns, security    |
| `react`        | Component patterns, hooks, state, performance, accessibility |
| `nextjs`       | App Router, route handlers, caching, server actions          |
| `typescript`   | Standards, types, refactoring, debug                         |
| `styling`      | Tailwind v4, Bootstrap                                       |
| `rust`         | Language style, modules, async, Tauri                        |
| `php`          | Laravel, WordPress, WooCommerce, Drupal                      |
| `python`       | Django, REST API                                             |
| `go`           | Microservices                                                |
| `bash`         | Shell scripting standards                                    |
| `javascript`   | Chrome extensions, SvelteKit, Vue, HTMX, Shopify             |
| `deploy`       | GitHub security, Sonnet                                      |
| `integrations` | Supabase, Stripe, Payload CMS, n8n                           |
| `monorepo`     | Turborepo                                                    |

## Rules Tiers

Rules are structured in three tiers so that the always-loaded context stays small:

- **Tier 0 (always loaded):** The single `CLAUDE.md` file installed to `~/.claude/CLAUDE.md`. It
  contains only an index (router + paths + short descriptions), no full rule bodies. Target size ≤
  15k chars; the build fails if this budget is exceeded. Full content is loaded on demand via
  `@rules/<path>.mdc` or your IDE’s tag conventions.
- **Tier 1 (umbrella / reference):** Rule files such as `core.mdc`, `api.mdc`, `nextjs.mdc` that act
  as indices or pointers to other rules. They list references rather than duplicating content.
- **Tier 2 (full content):** All other `.mdc` files under `src/rules/`. Full content lives here and
  is synced to `dist/global/.claude/rules/`; the agent loads them when a rule is referenced.

Do not edit `CLAUDE.md` by hand; it is generated by `pnpm rules:compile`. Edit files in `src/rules/`
and recompile.

## Rule Precedence

```
Task > Project > Stack > Global
```

- **Global**: Personal invariants (few lines)
- **Stack**: Next.js, React, Rust, PHP, Bash, etc.
- **Project**: Repo-specific overrides
- **Task**: plan, fix, refactor, review, debug

## Scripts

| Script                        | Description                                              |
| ----------------------------- | -------------------------------------------------------- |
| `pnpm run setup`              | Install, build, check, and link rules + skills to IDEs   |
| `pnpm run update`             | Update deps then run full setup (build, check, link)     |
| `pnpm build`                  | Compile canonical rules for all IDEs                     |
| `pnpm check:all`              | Format + lint + rules:check + skills:validate            |
| `pnpm check`                  | Alias for `check:all`                                    |
| `pnpm rules:compile`          | Compile `src/rules/` → `dist/global/` + `dist/markdown/` |
| `pnpm rules:check`            | Verify compiled output is current                        |
| `pnpm rules:link`             | Link rules globally for all IDEs                         |
| `pnpm rules:link:claude`      | Link to `~/.claude/`                                     |
| `pnpm rules:link:codex`       | Link to `~/.codex/`                                      |
| `pnpm rules:link:antigravity` | Link to `~/.gemini/`                                     |
| `pnpm rules:link:windsurf`    | Link to `~/.windsurf/`                                   |
| `pnpm skills:validate`        | Validate all 19 skills against AgentSkills spec          |
| `pnpm skills:llms`            | Generate `llms.txt` for skill discovery                  |
| `pnpm skills:prompt`          | Generate XML prompt with all skills                      |
| `pnpm skills:prompt:file`     | Write prompt to `available_skills.xml`                   |
| `pnpm skills:version:check`   | Check skill version consistency                          |
| `pnpm validate:install`       | Install Python venv for skills validation                |
| `pnpm format`                 | Format all files with Prettier                           |
| `pnpm format:check`           | Check formatting without writing                         |
| `pnpm lint`                   | ESLint check                                             |
| `pnpm lint:fix`               | ESLint auto-fix                                          |

## Plugins

### Cursor Plugin

Location: `dist/plugins/cursor/.cursor-plugin/plugin.json`

Bundles all rules and skills as a single Cursor plugin named **BusiRocket Agents**.

### Claude Code Plugin

Location: `dist/plugins/claude/.claude-plugin/plugin.json`

Use with: `claude --plugin-dir /path/to/busirocket-agents-tools`

## Roadmap

- **Phase 1 (MVP)** ✅ — Orchestrator, 8 core skills, canonical rules, IDE exports, plugins
- **Phase 2** — Registry: index 8000+ skills, allowlists per stack, scoring
- **Phase 3** — Auto-evolution: success/failure tracking, allowlist reordering

## License

MIT
