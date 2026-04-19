# busirocket-agents-tools (BRP)

Agent workflow engine + rules/skills orchestrator that enforces planning, testing, and review to
consistently produce high-quality code across IDEs, with global skills as the primary reusable BRP
surface.

## What It Is

BRP consolidates rules, skills, and an orchestration protocol into a single project that works as:

- A **Claude Code plugin** (`dist/plugins/claude/.claude-plugin/plugin.json`) with a marketplace
  manifest, bundled subagents, and opt-in hooks
- A **multi-IDE rules exporter** for lightweight guidance layers
- An **AgentSkills-compatible** skill collection (10 validated skills) with a Claude variant
  (`dist/skills/`) and a portable variant (`dist/skills-portable/`, Anthropic-only frontmatter
  stripped) for non-Claude IDEs
- A **multi-IDE skill linker** for popular agents/editors including Cursor, Claude Code, Codex,
  Continue, Cline, Windsurf, Antigravity, Gemini CLI, Goose, OpenHands, Augment, Roo, Kiro, Copilot,
  OpenCode, OpenClaw, Crush, Zencoder, AdaL, Trae, Qoder, and Qwen Code

## Quick Start

```bash
# Clone and run full setup (install, build, check, link rules + skills to IDEs)
git clone https://github.com/BusiRocket/busirocket-agents-tools.git
cd busirocket-agents-tools
pnpm run sync
```

`sync` is the canonical bootstrap command (install, build, check, rules:link, skills:link). To
update dependencies and refresh everything: `pnpm run update`.

For Codex and other skill-capable IDEs, the main BRP workflow surface is the global skills pipeline.
`AGENTS.md` remains useful as lightweight global guidance and routing, but it is not the primary
delivery mechanism for reusable BRP workflows in this project.

### As a Claude Code Plugin

After `pnpm run build` the plugin lives at `dist/plugins/claude/` with manifests under
`.claude-plugin/`, the 10 BRP skills flattened in `skills/`, the `brp-reviewer` subagent in
`agents/`, and an opt-in SessionStart hook under `hooks/`. Install it by pointing Claude Code at the
plugin root or by publishing the included `marketplace.json`. Then use `/brp-plan`,
`/brp-implement`, `/brp-fix`, etc. The `brp` orchestrator skill is hidden from the `/` menu
(`user-invocable: false`) so it can only be invoked by the model when routing is needed.

### As a multi-IDE distribution

`pnpm run skills:link` fans skills out to Cursor, Codex, Copilot, Windsurf, Antigravity (Gemini),
Continue, Cline, Goose, OpenCode, Augment, Roo, Kiro, Junie, Kilo, OpenHands, Zencoder, AdaL, Qoder,
Qwen Code, Trae, and OpenClaw. Claude Code receives the full `dist/skills/` variant with
Anthropic-only fields (`allowed-tools`, `paths`, `agent`, etc.). Every other IDE receives the
stripped `dist/skills-portable/` variant.

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
│   ├── rules/                   # Canonical rule definitions (.mdc) — core, react, nextjs, rust,
│   │                            # typescript, php, python, go, bash, styling, deploy,
│   │                            # integrations (supabase/stripe/n8n), monorepo, …
│   ├── skills/
│   │   ├── core/                # 8 BRP workflow skills (plan/implement/fix/refactor/review/
│   │   │                        # test/debug/docs) + brp-code-quality audit skill
│   │   ├── orchestrator/brp/    # Model-only router (user-invocable: false)
│   │   ├── skill-rules.map.json # Skill -> @rules manifest (source of truth)
│   │   └── activation-smoke.json
│   ├── agents/                  # Claude Code subagents (.md)
│   │   └── brp-reviewer.md      # Isolated findings-first PR reviewer used by brp-review
│   ├── hooks/                   # Plugin-scoped hooks shipped inside the Claude plugin
│   │   ├── hooks.json           # Declarative hook manifest (SessionStart by default)
│   │   └── session-start-brp-reminder.sh
│   └── core/
│       ├── protocol.md          # 6-step workflow contract
│       └── policy.json          # Routing, precedence, stack detection
│
├── dist/                        # Compiled output (generated, gitignored)
│   ├── global/                  # Per-IDE compiled rules
│   │   ├── .cursor/rules/
│   │   ├── .claude/rules/
│   │   ├── .agent/rules/        # Antigravity (Gemini)
│   │   ├── .windsurf/rules/
│   │   └── codex/rules/
│   ├── markdown/                # Guidance / index layers
│   │   ├── ALL_RULES.md
│   │   ├── CLAUDE.md
│   │   ├── AGENTS.md
│   │   ├── GEMINI.md
│   │   └── WINDSURF.md
│   ├── skills/                  # Claude variant (full Anthropic frontmatter)
│   ├── skills-portable/         # Portable variant (Anthropic-only fields stripped)
│   └── plugins/
│       └── claude/
│           ├── .claude-plugin/
│           │   ├── plugin.json
│           │   └── marketplace.json
│           ├── skills/          # Flattened from dist/skills
│           ├── agents/          # Copied from src/agents
│           └── hooks/           # Copied from src/hooks
│
├── scripts/                     # TypeScript build/link pipeline (tsx runtime)
│   ├── bin/                     # CLI entry points (run-compile-rules.ts, run-compile-skills.ts,
│   │                            # run-compile-plugins.ts, run-link-rules-global.ts,
│   │                            # run-link-skills-global.ts, …)
│   ├── commands/                # Orchestrator commands that bins import
│   ├── lib/                     # Reusable libs (fs, link, rules, skills, plugins)
│   └── constants/               # Path / limit constants shared across commands
└── package.json
```

## Skills (10 validated)

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

### Orchestrator (1)

| Skill | Purpose                                                            |
| ----- | ------------------------------------------------------------------ |
| `brp` | Model-only router for BRP command chains (`user-invocable: false`) |

### Code-quality audit (1)

| Skill              | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `brp-code-quality` | Audit and harden TS/Next quality gates (path-scoped to TS repos) |

### Subagents (1)

| Subagent       | Purpose                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| `brp-reviewer` | Isolated, findings-first PR reviewer invoked by `brp-review` via `agent:` |

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

## Skills-First Delivery Model

BRP uses a dual-layer model for global distribution:

- `~/.agents/skills` is the canonical internal directory managed by this product
- `pnpm skills:link` fans those compiled skills out to supported IDE targets
- `AGENTS.md` remains a lightweight guidance layer and should not be treated as the primary BRP
  workflow surface for Codex

Important:

- the canonical directory above is a product convention
- IDE target paths are linker-managed distribution destinations
- do not describe those destinations as vendor-native documented paths unless verified separately

## Rules Tiers

Rules are structured in three tiers so that the always-loaded context stays small:

- **Tier 0 (always loaded guidance):** Generated markdown such as `CLAUDE.md`, `AGENTS.md`,
  `GEMINI.md`, and `WINDSURF.md`. These are index-only guidance layers and routing aids, not the
  main reusable workflow surface for skill-capable IDEs.
- **Tier 1 (umbrella / reference):** Rule files such as `core.mdc`, `api.mdc`, `nextjs.mdc` that act
  as indices or pointers to other rules. They list references rather than duplicating content.
- **Tier 2 (full content):** All other `.mdc` files under `src/rules/`. Full content lives here and
  is synced to `dist/global/.claude/rules/`; the agent loads them when a rule is referenced.

Do not edit `CLAUDE.md` by hand; it is generated by `pnpm rules:compile`. Edit files in `src/rules/`
and recompile.

**Markdown outputs:** Generated under `dist/markdown/` by `pnpm rules:compile`. `ALL_RULES.md`
aggregates all canonical rules into a single reference. `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, and
`WINDSURF.md` are generated as index-only guidance files: they list rule references and short
descriptions only; no rule bodies are inlined. `CLAUDE.md`, `AGENTS.md`, and `WINDSURF.md` use
`@rules/...`, while `GEMINI.md` uses `@.agent/rules/...` and `@.agent/workflows/...`. This keeps the
always-loaded context small. Full rule content lives in `src/rules/` and is synced to each IDE’s
rules directory. To verify outputs against the Definition of Done (no inline mdc blocks, refs count,
size budget), run `pnpm rules:verify`.

## Rule Precedence

```
Task > Project > Stack > Global
```

- **Global**: Personal invariants (few lines)
- **Stack**: Next.js, React, Rust, PHP, Bash, etc.
- **Project**: Repo-specific overrides
- **Task**: plan, fix, refactor, review, debug

## Scripts

| Script                          | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| `pnpm run sync`                 | Full project bootstrap (install, build, check, rules:link, skills:link)  |
| `pnpm run update`               | Update deps then run sync                                                |
| `pnpm run build`                | Compile rules, skills (Claude + portable), and the Claude plugin         |
| `pnpm run plugins:compile`      | Generate `dist/plugins/claude/` (plugin manifest + marketplace + bundle) |
| `pnpm run check`                | Run all validations                                                      |
| `pnpm run check:all`            | Format, lint, rules:check, skills:validate                               |
| `pnpm run check:ci`             | CI alias of check:all                                                    |
| `pnpm run rules:compile`        | Compile `src/rules/` to `dist/global/` + `dist/markdown/`                |
| `pnpm run rules:link`           | Link rules to all supported IDEs                                         |
| `pnpm run skills:compile`       | Compile skills from `src/skills/` to `dist/skills/`                      |
| `pnpm run skills:inventory`     | Generate compatibility report for source skills                          |
| `pnpm run skills:link`          | Stage compiled skills canonically, then distribute to supported IDEs     |
| `pnpm run skills:package`       | Package compiled skills as zip artifacts                                 |
| `pnpm run rules:verify`         | Verify index-only outputs (DoD + CLAUDE golden master)                   |
| `pnpm run rules:check`          | Verify compiled output is current                                        |
| `pnpm run skills:validate`      | Validate all 9 skills against AgentSkills spec                           |
| `pnpm run skills:test`          | Run schema/idempotence/source-purity/snapshot/smoke tests                |
| `pnpm run skills:llms`          | Generate `llms.txt` for skill discovery                                  |
| `pnpm run skills:prompt`        | Generate XML prompt with all skills                                      |
| `pnpm run skills:prompt:file`   | Write prompt to `available_skills.xml`                                   |
| `pnpm run skills:version:check` | Check skill version consistency                                          |
| `pnpm run validate:install`     | Install Python venv for skills validation                                |
| `pnpm run format`               | Format all files with Prettier                                           |
| `pnpm run format:check`         | Check formatting without writing                                         |
| `pnpm run lint`                 | ESLint check                                                             |
| `pnpm run lint:fix`             | ESLint auto-fix                                                          |

`sync` is the primary command used to bootstrap the project locally.

## Skills Compilation Contract

- `src/rules` is the only source of truth for rule content.
- `src/skills` must stay pure source: template `SKILL.md`, `agents/openai.yaml`, optional
  `references/`, `scripts/`, and `assets/`, no compiled Rules Index and no inline rule bundles.
- `dist/skills` is the installable artifact and receives generated `Rules Index` sections from
  `src/skills/skill-rules.map.json`.
- `pnpm skills:link` stages `dist/skills` into the product-managed canonical directory
  `~/.agents/skills` and then distributes those artifacts to IDE-specific targets.
- Each source skill must define only `name` and `description` in frontmatter.
- Richer behavior metadata belongs in `agents/openai.yaml`, not in `SKILL.md` frontmatter.

### Skill Quality Contract

- Write descriptions for strong implicit invocation:
  - what the skill does
  - when it should trigger
  - when it should not trigger
- `agents/openai.yaml` is required and should define:
  - `interface.display_name`
  - `interface.short_description`
  - `interface.default_prompt` for workflow skills
  - `policy.allow_implicit_invocation`
  - `busirocket.skill_class`
  - `busirocket.failure_mode` for workflow skills
- Use `references/` for high-value progressive disclosure when a workflow needs structure or
  rubrics. Do not add references or scripts unless they improve fidelity or determinism.
- Declare `dependencies.tools` when a skill meaningfully depends on MCP or other tools.

### Skill Classes

- `workflow` — routes and executes multi-step work with explicit outputs, boundaries, and
  escalation.
- `domain` — injects narrower implementation constraints for a stack or subsystem.
- `execution-assist` — adds deterministic helper behavior through references, scripts, or tools.

### Skill-Rules Governance

- Use `src/skills/skill-rules.map.json` to map skills to `@rules/...` references.
- Recommended size: 3-8 rules per skill.
- Warning threshold: 10+ rules. Manual review threshold: 12+ rules.
- Prefer mapping order: core -> stack -> specialty -> optional.
- If a skill keeps growing, split scope into a new skill instead of adding more rules.
- Keep workflow sequencing, deliverable format, escalation rules, and tool discipline inside the
  skill. Keep reusable coding laws and architectural heuristics inside rules.

### Skills Pipeline

```bash
pnpm run rules:compile
pnpm run skills:compile
pnpm run skills:validate
pnpm run skills:test
pnpm run skills:package
pnpm run skills:link
```

`pnpm run skills:validate` also writes `dist/reports/skills-quality-report.{json,md}` so
low-fidelity skills and activation collisions can be ranked instead of only pass/fail checked.

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
