# TODO Log

> Searchable record of closed project work. Active work lives in `TODO.md`.

## 2026

### 2026-07

- [x] 2026-07-19 — **Router:** Deterministic `UserPromptSubmit` prompt router shipped and registered
      live.
  - Result: `src/hooks/user-prompt-skill-router.sh` + `utils/route_prompt.py`, routing on domain
    nouns, silent on no match; tested against 1053 verbatim corpus prompts; 4 extra lanes from the
    Codex 30-day pass (`contract-ops`, `agent-config`, `environment-ops`, `repo-modernization`), 2
    candidates rejected on precision (`generic-review` ~13%, `job-search` n=4); `contract-ops` regex
    hand-narrowed to 7/7 precision.
  - Evidence: commits 8a33f2a, 4c3c208, f5c3cd2; `ROUTER_TEST.ts` wired into `check:all`; registered
    in `~/.claude/settings.json`.

- [x] 2026-07-19 — **Hooks:** Hook layer brought under repo management and actually linked.
  - Result: SessionStart reminder no longer names nonexistent commands (RC-8); `hooks:link` mirrors
    `skills:link` into `~/.agents/hooks` with a drift check; Stop verification gate managed as
    `src/hooks/stop-verification-gate.sh` with 4-behavior tests and non-Node project detection;
    phantom `src/core/policy.json` (zero readers) deleted. Root cause closed: the plugin was never
    installed, so no hook in this repo had ever run (RC-10).
  - Evidence: commits c05c5ec, b7f3356, 68eeec9, 30014f9, 79e5431; Stop hook live in
    `~/.claude/settings.json`.

- [x] 2026-07-19 — **Skills:** `brp-traffic-client` created; validators resurrected; cache purged.
  - Result: skill turns captured traffic (HAR/CDP/curl/Playwright) into HTTP clients, with the
    "screenshot loop is the smell" implicit trigger from a cross-project audit; 4 orphaned
    description validators wired into `skills:lint`; ~178MB stray plugin-cache temp dirs removed.
  - Evidence: commits 4472d90, 3e8c895, 9da58f3, 646bdf9, 727ddae, a5c0122, eb94471.

- [x] 2026-07-19 — **Build:** TypeScript 7 fallout fixed; type-check made a gate.
  - Result: accidental TS 6→7 bump broke ESLint/typescript-estree; restored via the dual-alias
    layout; two pre-existing type errors fixed (`linkRulesGlobal.ts`, `stripFrontmatterKeys.ts`);
    `pnpm run type-check` folded into `check:all`. The `findIde("codex")` crash from the registry
    edit was later re-fixed with a regression test.
  - Evidence: commits 3490932, 40ee182; `package.json` `check:all`.

- [x] 2026-07-19 — **agents-skills repo:** Audited, orphaned guidance ported, repo archived.
  - Result: 3 substantive orphaned rule topics (Zod conventions, Zustand store organization,
    guard-helper semantics) plus minor gaps ported into `src/rules/`; deliberate divergences kept
    (new repo's criteria win); `BusiRocket/agents-skills` archived on GitHub with a README notice.
  - Evidence: commit dfcd786; `gh repo view` shows `isArchived: true`.

- [-] 2026-07-19 — **Audit:** Measurement claims retracted the same day they were made.
  - Resolution: "5.4% skill firing" was an 8x denominator artefact (real interactive rate ~42%);
    "286 skills dilute selection" false (41/1188 reachable); "627 security-review sessions need a
    skill" false (purpose-built plugin, not a miss); "8 BRP descriptions clipped at 400 chars" was
    the auditor's own truncation; `vexa-email-triage` skill rejected (self-contained prompts).
  - Evidence: commits 5fed875, eb94471, 6ba86b9; `TODO-skills-audit.md` corrections.

- [-] 2026-07-21 — **Backlog:** TODO-consolidation workflow (40 extraction agents) abandoned
  mid-flight.
  - Resolution: session ended right after launching workflow `wf_7d194de2-e6c`; no output was ever
    observed. Superseded by the `brp-todo-create`/`brp-todo-work` skills (commit f888df7,
    2026-07-31) and the 2026-08-13 audit that produced this backlog.

- [-] 2026-07-21 — **Backlog:** Root `CLAUDE.md` with a "Continuous TODO Capture" section — never
  created, no longer needed.
  - Resolution: the identical maintenance rule ships in `~/p/CLAUDE.md`, which loads for every
    session in this repo; duplicating it in a repo-root file would violate the rule's own
    no-duplication clause. TODO files are now repo-local per that rule's scope note.

### 2026-08

- [x] 2026-08-13 — **Linker:** `skills:link` was silently wiping every externally-installed skill.
  - Result: `cleanGlobalPrefix` with `prefix: ""` matched everything via `startsWith("")`; every
    link run deleted all 88 non-repo skills in `~/.agents/skills` and IDE targets. Guard added with
    test; 86/88 restored from `~/.agents/.skill-lock.json`; `frontend-skill` and `task-quality-kpi`
    lost upstream (gone from their sources). Remaining losses tracked in `TODO.md` (Global agent
    config).
  - Evidence: commits aa2a972, 3db4a51; `CLEAN_GLOBAL_PREFIX_TEST.ts` in `link:test`.

- [x] 2026-08-13 — **Skills:** Full 16-skill realignment with Anthropic/OpenAI authoring guidance.
  - Result: orchestrator SKILL.md rewired from the deleted `policy.json` to the real routing
    mechanism; `handoff` got its missing `agents/openai.yaml`; `brp-release` now pushes the tag it
    cuts; escalation rules moved from openai.yaml into SKILL.md where Claude reads them; missing
    `## Workflow`/`## Output` sections added; descriptions moved to third person; byte-identical
    reference duplication guarded by `TODO_FORMATS_SYNC_TEST`; Cursor history coverage added to the
    brp-todo skills; BusiRocket baseline folded into `brp-code-quality` with bundled docs and drift
    test; cost-based model routing added to both brp-todo skills; codex demoted to a rules-only link
    target; boundaries ESLint config migrated to the v7 policies schema.
  - Evidence: commits 32bdb24, 707993d, c5d07de, f72a4bb, 6cc709b, 1318f36, 0d28b5b;
    `pnpm run check` green.

- [x] 2026-08-13 — **Backlog:** Repo took ownership of its backlog.
  - Result: items routed from the `~/p` meta list and the archived `agents-skills` backlog; this
    audit then consolidated all accessible Claude/Codex/Cursor/Antigravity history into
    `TODO.md`/`TODO_LOG.md` with coverage tracked in `TODO_HISTORY_INDEX.jsonl`.
  - Evidence: commits 44249f5, 969f47f; this file.

- [x] 2026-08-13 — **Rules:** Glob-narrowing branch resolved — work is on main.
  - Result: every commit reachable from `bce0adb` (branch `skills/deterministic-prompt-router`,
    since deleted) has a patch-equivalent on main; nothing left to merge or discard.
  - Evidence: `git cherry main bce0adb` lists no `+` commits.

- [x] 2026-08-13 — **Tooling:** `.serena` schema migration committed in this repo.
  - Result: `.serena/project.yml` committed; working tree clean. The Osseus/RocketUpdater
    counterparts remain open in `~/p/osseus/TODO.md` (their entry already names both repos).
  - Evidence: commit 5aa7162; `git status` clean.

- [x] 2026-08-13 — **Harness:** Layer-4 "success is silent, failure is loud" gate is global, not
      brain-only.
  - Result: the Stop verification gate ships from this repo and is registered machine-wide via
    `hooks:link`; repos opt in by defining a `check` script. Remaining per-repo gap (verticagtm
    lacks a plain `check` alias) filed in that repo's TODO.
  - Evidence: `src/hooks/stop-verification-gate.sh`; Stop hook in `~/.claude/settings.json`.

- [x] 2026-08-13 — **Router:** invoice-ops lane no longer summons the nonexistent skill.
  - Result: the directive was rewritten to carry only the live-source verification rule; the
    invoice-quarter-close rebuild stays open in `TODO.md` with the old MacBook Pro named as the
    first place to look.
  - Evidence: commit 82620a2; `pnpm run hooks:test` 10/10 after rebuild+relink.
  - Files: `src/hooks/utils/route_prompt.py`, `scripts/lib/hooks/constants/LANE_MARKERS.ts`.

- [x] 2026-08-13 — **Router:** Session-level lane idempotency shipped.
  - Result: each lane fires at most once per session, tracked in a per-session temp file keyed by
    the sanitized `session_id`; stateless (fires every time) when no session_id arrives, so existing
    behavior and tests are unchanged. The multi-ask note still fires per prompt.
  - Evidence: commit cc67b18; new "a lane fires at most once per session" case,
    `pnpm run hooks:test` 11/11.
  - Files: `src/hooks/utils/route_prompt.py`, `scripts/lib/hooks/ROUTER_TEST.ts`,
    `scripts/lib/hooks/runRouterHook.ts`.

- [x] 2026-08-13 — **Skills:** Dead activation-fixture layer deleted.
  - Result: `activation-smoke.json`, `activation-acceptance.json`, `SMOKE_PATH.ts`,
    `ACCEPTANCE_PATH.ts` removed (no consumers; superseded by `ROUTER_TEST.ts`), plus the two root
    `.lint-*.json` files — committed ESLint output still pointing at the retired busirocket-agents
    checkout.
  - Evidence: commit d986366; type-check, lint and `skills:validate` green after removal.

- [x] 2026-08-13 — **Rules:** Staffbase auto-load gap documented; store-vs-context reason added.
  - Result: `staffbase.mdc` now states in-file that repos without `widget/`/`configuration/` markers
    need a manual `@staffbase` (globs kept narrow on purpose — `**/src/**` would load the rule
    everywhere, deviating from the TODO's suggested fix); `state-management.mdc` now carries the
    measured selector-vs-Context rationale (~45ms/100 consumers vs ~2ms/3 subscribers).
  - Evidence: commit 6fb29b1; `pnpm run rules:check` green after regeneration.

- [x] 2026-08-13 — **Supply chain:** Hidden-Unicode scan gates this repo's check.
  - Result: `hygiene:test` (in `check:all`) fails when any tracked text file carries variation
    selectors or zero-width characters — the GlassWorm payload channel; predicate extracted to
    `scripts/lib/isHiddenUnicode.ts` for reuse. The one existing offender was a decorative emoji in
    the audit history, replaced per the text-hygiene rule. Other published repos remain open in
    `TODO.md`.
  - Evidence: commit 9d3609c; `pnpm run hygiene:test` 1/1.

- [-] 2026-08-13 — **Audit:** "Merge the codex deep-pass findings into Round 1" closed as overtaken.
  - Resolution: the scratchpad reports (`findings.md`, `findings30.md`) no longer exist on disk;
    their content was reconstructed from the Codex rollouts during this audit and everything
    actionable was either already absorbed into `TODO-skills-audit.md` (with corrections) or is now
    tracked in `TODO.md`.
