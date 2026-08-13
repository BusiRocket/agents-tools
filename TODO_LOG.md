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

- [x] 2026-08-13 — **Recovery:** Lost global skills and the security guidance restored from the old
      MacBook Pro over SSH.
  - Result: all 6 `ckm-*` skills (banner-design, brand, design, design-system, slides, ui-styling),
    `frontend-skill` and `task-quality-kpi` (the two "lost upstream" from the linker wipe), and
    `~/.claude/claude-security-guidance.md` (original 5269-byte file, dated 2026-07-19 — recovered,
    not rewritten; its absence here traces to the machine clone, not a deletion on this machine)
    rsync'd back. `skills:link` re-run afterwards; all restored skills survive the `aa2a972` guard.
    `ckm-*` remain lock-untracked on both machines — follow-up filed in `TODO.md`.
  - Evidence: `ls ~/.agents/skills/ckm-*` (6 dirs), `ls -la ~/.claude/claude-security-guidance.md`;
    `pnpm run skills:link` clean; old machine searched via `find`/`mdfind` over `~/.agents`,
    `~/.claude`, `~/p`.

- [x] 2026-08-13 — **Recovery:** `invoice-quarter-close` and the `brain` skill confirmed absent from
      the old MacBook Pro — restore path exhausted.
  - Result: SSH search (`find` maxdepth 6 + `mdfind`, both machines' lock files) found no copy of
    either. `invoice-quarter-close` stays open in `TODO.md` (Router) as a rebuild from the audit's
    trigger draft; the `brain` skill rebuild is filed cross-project in `~/p/brain/TODO.md`
    (Infrastructure) since it wraps that repo's tooling.
  - Evidence: remote `find`/`mdfind` output empty; neither name in either `.skill-lock.json`.

- [x] 2026-08-13 — **Audit:** Runtime/catalog split resolved — the catalog structurally misses two
      skill classes.
  - Result: of the 7 fired-but-uncatalogued skills, 4 are Claude Code harness built-ins never on
    disk (`artifact-design`, `claude-api`, `claude-in-chrome`, `schedule`), `impeccable` is a live
    user-linked skill in `~/.agents/skills`, `job-search` is repo-scoped inside
    `cristian-deluxe-developer-portfolio/.claude/skills` (only loads there), and
    `migrating-to-typescript-7` no longer exists anywhere on disk (removed since the corpus week).
    Conclusion recorded by the audit stands: tune against the runtime listing, never the disk
    catalog.
  - Evidence: session skill listing; `ls ~/.agents/skills/impeccable`;
    `ls ~/p/cristian-deluxe-developer-portfolio/.claude/skills/job-search`; `mdfind` empty for
    `migrating-to-typescript-7`.

- [-] 2026-08-13 — **Skills:** `job-search` trigger-phrase item rerouted to its owning repo.
  - Resolution: the "exists nowhere on this machine" premise was wrong — the skill lives in the
    portfolio repo (repo-scoped). Improvement filed in
    `~/p/cristian-deluxe-developer-portfolio/TODO.md` (Skills).

- [x] 2026-08-13 — **Skills:** The 7 competing BRP skills demoted to orchestrator references.
  - Result: `brp-plan`, `brp-implement`, `brp-test`, `brp-debug`, `brp-fix`, `brp-refactor` and
    `brp-review` are no longer standalone skills; their workflows and templates live under
    `src/skills/orchestrator/brp/references/`, the orchestrator chains point at the references, the
    rules-map entries were pruned, and the README reflects the 9-skill surface. Process lanes are
    owned by the superpowers family per the 2026-07-19 decision (user re-confirmed today). Side
    find, fixed at the root: canonical staging never pruned removed skills inside namespace dirs
    (`core/`, `orchestrator/`), so the 7 would have shipped to Codex forever;
    `removeStaleNamespaceEntries` now runs in `populateCanonicalSkillsDir` with 3 tests in
    `link:test`.
  - Evidence: `pnpm run check` green (link:test 6/6); `skills:link` distributes 9 skills;
    `~/.claude/skills` and `~/.agents/skills/core` carry no demoted entries; externally installed
    skills (`ckm-*` 6/6) untouched.

- [x] 2026-08-13 — **Skills:** `project-continuation` built behind the `continuation` router lane.
  - Result: new core skill (SKILL.md + openai.yaml + rules-map entry) that reconstructs state from
    git, TODO backlogs, plan and handoff artifacts before resuming; the `continuation` lane
    directive now summons it explicitly (lane marker unchanged, so router tests were untouched); the
    read-side twin of `handoff`. Distributed to all IDE targets.
  - Evidence: `pnpm run check` green after `build` + `hooks:link` (drift gate caught the
    out-of-order link once, as designed); `hooks:test` 11/11; `skills:link` distributes 10 skills;
    `ls ~/.claude/skills | grep project` shows it.

- [-] 2026-08-13 — **Skills:** Consolidation-by-delegation superseded by the demote decision.
  - Resolution: user confirmed 2026-08-13 that the recorded demote decision wins over the later
    "make superpowers delegate to brp-*" idea (can't delegate to skills being retired). The
    surviving half of the consolidation intent — one family per lane — is exactly what the demote
    implements.

- [x] 2026-08-13 — **Global agent config:** `ckm-*` skills' true installer identified; lock
      registration ruled out; durable recovery path archived.
  - Result: the 6 `ckm-*` skills are ClaudeKit.cc paid-marketplace content (frontmatter author
    `claudekit`, v2.1.0). No public GitHub source exists (org repos and `mrgoonie/claudekit-skills`
    carry only ui-styling/frontend-design variants), and the `skills` CLI (v1.5.22) only accepts
    GitHub packages, so an honest `~/.agents/.skill-lock.json` entry is impossible — a fabricated
    one would 404 on `experimental_install`. Instead the provenance is recorded in
    `~/p/brain/topics/claude-skills-ecosystem.md` and a backup tarball archived at
    `~/p/brain/sources/vault/ckm-skills-v2.1.0-claudekit.tar.gz` (211 entries; extract into
    `~/.agents/skills/`).
  - Evidence: brain commit 69c0b6a; `tar tzf` lists 211 entries; GitHub API tree queries for
    `claudekit` org and `mrgoonie/claudekit-skills`; `npx skills add --help` (GitHub-only sources).

- [x] 2026-08-13 — **Skills:** `invoice-quarter-close` rebuilt over the brain playbook.
  - Result: new core skill from the audit's RC-5 trigger draft; the method stays in
    `~/p/brain/business/quarter-close-playbook.md` and the skill carries the trigger surface, the
    live-source verification rules, and the workflow skeleton (no secrets, no company data). The
    `invoice-ops` lane directive now summons it. `closes`/`reconciles` added to `ACTION_WORDS` so
    the description passes the specificity lint honestly.
  - Evidence: commit 7edcd31; `pnpm run check` green; `skills:link` distributes 11 skills;
    `ls ~/.claude/skills | grep invoice` shows it.

- [x] 2026-08-13 — **Skills:** `stakeholder-recap` built behind its existing router lane.
  - Result: channel-history-first recap skill (evidence-backed claims, communication-norms
    disclosure shape, draft-before-post); the `stakeholder-recap` lane directive now summons it
    explicitly (marker unchanged).
  - Evidence: commit 45c136f; `pnpm run check` green; `skills:link` distributes 12 skills.

- [x] 2026-08-13 — **Skills:** `lovable-sync` built with a new router lane — the TODO's "lane
      exists" premise was false for this one.
  - Result: two-way design-parity skill (pull latest, difference map, slice-by-slice port, preserve
    working functionality); new `lovable-sync` lane placed before `debug` (one real prompt carries
    "no funciona") and before `frontend` ("el diseño" would steal it); 6 verbatim transcript prompts
    added as fixtures; the "prompt para lovable" fixture stays correctly silent.
  - Evidence: commit 2136a70; `pnpm run check` green (router fixtures pass); `skills:link`
    distributes 13 skills.

- [x] 2026-08-13 — **Skills:** External validator rebuilt; the "dead subsystem" blocker closed by
      the user's rebuild decision.
  - Result: `.venv-validate` recreated from scratch (`pnpm run validate:install` over the moved venv
    only reported "already satisfied" and left the old `busirocket-agents` shebangs, so the
    directory was removed first); `agentskills --help` and a real `validate` run work. Side fixes at
    the root: `.venv-validate/**` added to the eslint ignores (pip vendors `.js` files the typed
    lint choked on). Residual fact filed in `TODO.md`: `detectValidator`/`runValidate` still have
    zero callers, and strictyaml rejects the `argument-hint: [x]` syntax.
  - Evidence: `.venv-validate/bin/agentskills --help` prints usage; `pnpm run check` green.

- [x] 2026-08-13 — **Skills:** Every description's "Trigger when" clause now opens before char 150,
      and a lint keeps it that way.
  - Result: 12 of 13 descriptions rewritten (handoff was already at 148) so the activation boundary
    survives listing truncation; first sentences compressed, boundaries preserved. New
    `descriptionTriggerPositionError` validator wired into `DESCRIPTIONS_TEST.ts` enforces the
    limit; the audit item's "16 skills" count predates the 7-skill demotion.
  - Evidence: commit 2cb270c; `pnpm run check` green (skills:lint passes the new test); measured
    positions 132-146.

- [x] 2026-08-13 — **Skills:** External `agentskills` validator wired into `skills:validate`; the
      orphan `detectValidator`/`runValidate` gained their callers.
  - Result: `validatePortableSkills` runs the validator over `dist/skills-portable` (the emitter
    already strips Anthropic-only frontmatter, so the strictyaml `argument-hint: [x]` quirk and
    `paths`/`user-invocable` field rejections never surface — no finding filtering needed, which the
    TODO item expected). Missing venv or missing dist degrade to an explicit warning, not a silent
    pass. Negative test: a synthetic skill with a bogus frontmatter field fails the run.
  - Evidence: `pnpm run skills:validate` prints `agentskills OK (13 skills, method: venv)`;
    synthetic bad skill exits 1; `pnpm run check` exit 0.

- [x] 2026-08-13 — **Harness:** `security-review` auto fan-out cost vs value measured (audit Round 1
      open question closed; the keep/scope/disable decision stays in `TODO.md`).
  - Result: last 30 days of `~/.claude/projects` transcripts: 2,324 machine sessions open with the
    fan-out prompt ("Review this change for security vulnerabilities." 2,285 + "You previously
    flagged these candidate vulnerabilities:" 39) out of 3,332 total sessions (70%). All on
    `claude-opus-4-7`. Tokens: 25.9M output, 1.246B cache-read, 227M cache-write, 0.12M raw input —
    ~$2,691/30d list-price equivalent (~$1.16/session, ~77 sessions/day) at Opus 4.7 rates ($5/$25
    per MTok, cache read 0.1x, write 1.25x). Value: 753 sessions end with an explicit clean verdict,
    1,349 with a verbose verdict (sampled ones read clean), 222 with no final text; only 39 (1.7%)
    escalated to a candidate-verification pass. No confirmed real finding observed.
  - Evidence: `sr_measure.py` in the session scratchpad over 3,381 transcript files; token sums and
    outcome counts printed above; pricing from the claude-api skill model table.
