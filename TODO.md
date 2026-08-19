# TODO — agents-tools

> Consolidated from the accessible Claude, Codex, Cursor, and Antigravity project history plus the
> `~/p` meta backlog (routed 2026-08-13) and the archived `BusiRocket/agents-skills` backlog. Last
> reviewed: 2026-08-13. History coverage: Partial — Claude Code transcripts before 2026-07-19 no
> longer exist on disk (repo work starts 2026-02-27), and the 2026-07-19 audit scratchpad reports
> (`findings.md`, `findings30.md`) were reconstructed from Codex rollouts, not read from disk. Open
> items from `TODO-skills-audit.md` (append-only audit history) are tracked here; that file is no
> longer a backlog.
>
> States: `[ ]` pending · `[~]` partial or unverified · `[!]` blocked · `[x]` verified complete ·
> `[-]` obsolete or superseded. Closed work moves to `TODO_LOG.md`.

## Router and hooks

- [ ] Round 2 audit re-run with the revised metrics: directive adherence (the one that matters),
      router coverage (baseline 172/1053 = 16%) and hand-measured lane precision. Include the known
      frontend miss: a plain "check this header on mobile" trigger test (2026-07-19) fired no design
      skill. Baselines and metric definitions in `TODO-skills-audit.md`.

## Skills

- [ ] Recreate `.venv-validate` from this checkout. Its `agentskills` shebang still points to the
      retired `/Users/cristiandeluxe/p/busirocket-agents/` path, so `pnpm check` silently skips the
      external AgentSkills validator even though the repository-local executable exists.
- [ ] Candidate skills from the Codex 30-day pass, unbuilt: `communications-work-intake` (13
      sessions; Slack/Discord/WhatsApp/email intake, wider than `stakeholder-recap`) and
      `document-intake-reconciler` (Downloads/PDF/OCR triage into Holded).
- [ ] Pilot skill-creator-style blind A/B evals on one BRP skill (with-skill vs without-skill,
      isolated contexts); if pass rates match, the skill adds nothing. Also pressure-test skill
      wording adversarially (Superpowers method). Source:
      `~/p/brain/topics/claude-skills-ecosystem.md`.
- [ ] Adopt into `brp-docs`: the ADR bar (hard to reverse + surprising + real trade-off, minimal
      template, `docs/adr/NNNN-slug.md`) and the `CONTEXT.md` glossary format (opinionated terms,
      avoid-lists, no implementation details). Full spec: `docs/mattpocock-skills-diff-2026-08.md`
      section 1.
- [ ] Evaluate a conversation-only "grill" gate skill for business/marketing decisions (offer,
      positioning, pricing), modeled on Pocock's grill-me as used by practitioners on non-code
      ideas: questions in rounds (dependent questions wait), ~46 questions / 4 rounds as an
      ordinary session, ends when nothing is left to ask, and the pushback rule ("a session with
      no pushback is a session you didn't need"). Source:
      `~/p/brain/topics/claude-skills-ecosystem.md` (2026-08-19 section).
- [ ] Measure invoked token cost of each BRP skill and record it in the skill docs, with Pocock's
      `/grilling` at 345 tokens invoked as the reference for a gate-shaped skill. Anything an
      order of magnitude above that needs a reason. Source:
      `~/p/brain/topics/claude-skills-ecosystem.md` (2026-08-19 section).
- [ ] Candidate BRP rule/hook: require a screen-recording video attached to any PR that changes UI
      state (steipete's one-line AGENTS.md rule at openclaw; GitHub accepts programmatic video
      upload — worked example openclaw/openclaw#124013). Fits next to the existing
      evidence-before-claims posture. Source: `~/p/brain/topics/claude-code-practice.md`
      (2026-08-19 X sweep section).
- [ ] Adopt into the `brp` test lane: pre-agreed seams gate, red-before-green + vertical slicing,
      the three test anti-patterns (implementation-coupled, tautological, side-channel), and the
      boundaries-only mocking policy. Full spec: `docs/mattpocock-skills-diff-2026-08.md` section 2.
- [ ] Adopt into the `brp` debug/fix lanes: the Phase-1 red-loop gate (no hypothesis without a run
      command), the feedback-loop ladder, minimisation, 3-5 falsifiable hypotheses with a user
      checkpoint, tagged debug logs, and the regression-seam judgment. Full spec:
      `docs/mattpocock-skills-diff-2026-08.md` section 3.
- [ ] Adopt into `brp-refactor`/`brp-plan`: git-hot-spot scoping, the deletion test, the candidate
      report with strength badges and a hard stop before interface design, design-it-twice, and ADR
      consultation. Resolve first the two named conflicts with the atomic-file rule and the
      "preserve public interfaces" rule. Full spec: `docs/mattpocock-skills-diff-2026-08.md`
      section 4.

## Skills library cleanup

> Decided 2026-08-17: curate one list and link it to every IDE including Antigravity, rather than
> the current split where Claude Code is offered 13 skills and the other 94 bundles reach only
> Codex. Nothing is deleted; unused bundles leave the default fan-out and stay in the repo.
> Measurements: `~/p/dotfiles/docs/machine-inventory/skills-triage.md`.

- [ ] Link the curated list into `~/.claude/skills` and into Antigravity (`~/.gemini/config/skills`,
      which currently carries only the 7 BRP skills). Claude Code sees 13 of 273 skills today and
      all 13 are BRP; the rest were never offered to it.
- [ ] Refill `brp-todo-work` and `brp-todo-create` from the prompt files they were compressed from.
      Measured 2026-08-18: `~/p/Prompts/todo-workflows/execute-todo.md` (326 lines, eight numbered
      phases) was invoked 70 times in 30 days against 7 for the skill, and
      `create-todo-from-history.md` (318 lines) against `brp-todo-create` (78). The skills are lossy
      compressions of artifacts that work better. Highest-confidence item in the study.
- [ ] Build `communications-work-intake`: Discord, Slack, WhatsApp and email intake to context plus
      drafted reply. 141 requests across four projects in 30 days; `stakeholder-recap` covers only
      the narrower recap shape and fired once. Largest measured gap.
- [ ] Build a screenshot-to-component skill for the real stack (shadcn/Radix/Tailwind, project
      tokens, existing components). 182 requests arrive as pasted screenshots; the seven design
      skills installed are all about taste or review and none does this job. Use `ckm-ui-styling` as
      source material, not as a competitor.
- [ ] Extend the business lane next to `invoice-quarter-close` (27 invocations, the most-used
      non-Superpowers skill): contracts review and modification (26 requests) and digital PDF
      signing (12) have no coverage.
- [ ] Build a background-job watch procedure: 44 requests asking for progress on long-running jobs,
      with no skill and only `/loop` as a harness feature.
- [ ] Delete the 16 Java/Spring-only bundles (14 `unit-test-*` plus `clean-architecture` and
      `docs-updater`). Body scan confirms no other tech signal, and no Spring codebase exists in
      `~/p`.
- [ ] Review skill by skill against the work actually done here, deciding for each what it does and
      whether it earns its place. This is the real cleanup: the library is an accumulation of
      experiments that were never triaged. Start with the six bundles holding ~170 SKILL.md files
      and one recorded call between them (`engineering-advanced-skills` 47, `marketing-skills` 45,
      `engineering-skills` 37, `product-skills` 17, `ra-qm-skills` 14, `pm-skills` 8), then the 21
      Java/Spring `unit-test-*` bundles, which match no codebase in `~/p`.
- [ ] Resolve the capabilities that exist on several surfaces at once: `frontend-design` is both an
      `~/.agents` bundle and an official plugin, both called 11 times; `context7` is a plugin, an
      MCP server and an always-on rule. Pick one surface each.
- [ ] Re-check `brp-rust-quality` and `lovable-sync` after another month. Both are linked and had
      zero calls in the 30-day window, but both are recent and narrow, so the window is too short to
      conclude anything.
- [ ] Re-run the classification for `pm-skills/SKILL.md` and `drizzle-orm-patterns/SKILL.md`, the
      two the mining pass dropped.

## Skill library and learning loop

> Shipped 2026-08-18: the four curation states, seeding from the lock, per-skill curation, linking
> what is adopted, the transcript observer, trigger learning with secret redaction, delegated
> classification, the router audit, proposals and automatic parking behind a grace period. Claude
> Code went from 13 skills offered to 30. Spec and plan:
> `docs/superpowers/specs/2026-08-18-skill-library-and-learning-loop-design.md`.

- [ ] Check the weekly loop reports (`~/.agents-learning/reports/`, LaunchAgent
      `com.cristian.library-loop`, Sundays 06:30) and whether the promoted skills fire. A promotion
      that does not change invocation counts is a proposal to demote, and that is the first real
      test of whether any of this works. First scheduled run will also do the first full
      classification pass (~26 agy batches), so expect it to take a while and check
      `~/.agents-learning/loop.log` if the report is missing.
- [ ] Review the description proposals `library:describe` produces. It reports which measured
      phrases a description does not reflect and stops there, on purpose: descriptions are validated
      for activation boundaries, so a generated edit can fail the build.
- [ ] Exercise patch reapplication against a real fork. Implemented and tested for the conflict
      case, never run for real, because nothing is forked yet.
- [ ] Codex-side usage stays unmeasured. `library:observe-codex` refuses to report it: an anchored
      read pattern returns 912, 911 and 913 across unrelated skills, which is a catalogue listing,
      not use. Either Codex gains a real invocation signal or proposals stay Claude-scoped.
- [ ] Decide what to do with the 87 parked entries, now that parking is cheap and reversible. The 16
      Java/Spring bundles are the obvious first pass.

## Machine provisioning

> Scope decided 2026-08-17: this repo stays public and data-free and holds the engine (schemas,
> capture readers, per-target renderers, CLI). The manifests carrying real values stay in the
> private `BusiRocket/dotfiles` repo, which already owns brew, shell, symlinks, launchd and secrets.
> Measured inventories behind these items: `~/p/dotfiles/docs/machine-inventory/`.

- [ ] Restore or clone the private machine instance at `~/p/dotfiles/machine/mcp.json`.
      `pnpm machine:diff -- --json` currently fails with `no mcp.json`, so the shipped MCP engine
      cannot audit or reproduce the live Claude/Codex configuration on this machine.
- [ ] Plugin manifest: marketplaces plus plugins pinned by version, and the enabled/disabled state,
      which is the part no current tooling records (18 enabled, 18 disabled today). Reinstalling all
      36 and leaving them on does not reproduce the machine.
- [ ] Plugin cache hygiene: 16 plugins keep stale older versions on disk (Figma 5, Amplitude, Sentry
      and Superpowers 4 each) inside a 2.7 GB cache. Decide whether the apply step prunes versions
      that no plugin resolves to.
- [ ] Services: render launchd plists and systemd units from one description. Every user-authored
      LaunchAgent except two hardcodes an absolute home path.
- [ ] Profiles: compose domains into named targets (`full` for a primary machine with both Claude
      profiles and the mempalace daemons, `lite` without daemons or the editable fork).
- [ ] Capture readers per domain, so the manifests can be regenerated from a live machine rather
      than hand-edited. Without them the manifests go stale in weeks, which is the failure mode the
      current rsync mirroring already shows.
- [ ] Record install provenance for the tools that have none: `agy`, `herdr`, `claude`, `codex`,
      `cursor-agent` exist only as opaque binaries or app-managed symlinks. `agy` is currently
      unrecoverable if the disk is lost.
- [ ] Pin how `codegraph` and Serena are installed. Both run daily as MCP servers but neither
      appears as a package in the runtime sweep, so no installer can claim completeness yet.
- [ ] `config` apply must merge, never replace: third-party tools (orca, atuin, warp) inject hooks
      into `settings.json` without asking, and a full rewrite drops them.
- [ ] `statusLine` in `settings.json` points at caveman `25d22f864ad6` while the installed version
      is `0d95a81d35a9`. Both directories exist so it works; it is a pin to a stale copy that a
      cache prune would break.
- [ ] `serena@claude-plugins-official` is installed but missing from `enabledPlugins`, so its state
      is defaulted rather than declared. Declare it.

## Supply chain and secrets

- [!] Rotate the eight still-live credentials recovered on 2026-08-17 from
  `~/.gemini/mcp_config.json`, and delete the copies that reached `portatil` and the `neo` VPS
  through `dotfiles/bin/sync-ai`, which rsyncs `~/.gemini` wholesale. Values and their uses are in
  `~/p/brain/business/misc-credentials.md`; the two ZeroHedge MongoDB URIs only need revoking.
  Blocked on the rotation being done by hand. The local file is already clean.
- [ ] Install `detect-secrets` as a pre-commit hook and enable GitHub secret scanning on the active
      repos. A leaked AWS key was used 11 minutes after the push in one documented case. Cheap,
      one-time. Source: `~/p/brain/topics/app-security.md`.
- [ ] Audit what else `sync-ai` ships wholesale. `~/.gemini` carried ten credentials for months; the
      same script also mirrors `~/.codex`, `~/.agents`, `~/.claude/projects` and
      `~/.claude/history.jsonl`, with exclusions maintained by hand.
- [~] Add a variation-selector scan to CI for the published repos — GlassWorm hid payloads in
  zero-width Unicode that no diff shows. This repo covered 2026-08-13 (`hygiene:test` in
  `check:all`, scans all tracked files; `scripts/lib/isHiddenUnicode.ts` is reusable). Remaining:
  the other published repos. Source: `~/p/brain/topics/supply-chain-security.md`.
- [~] Audit CI for long-lived registry publish tokens readable by third-party actions (the LiteLLM
  vector was a compromised Trivy action stealing `PYPI_PUBLISH`); prefer OIDC/Trusted Publishers.
  This repo verified clean 2026-08-13: no `.github/workflows`, no CI at all. A keyword sweep of
  `~/p` flagged 16 repos whose workflows mention publish/token terms and need the real audit:
  baseline, dj-rocket, helm-cron, helm-drupal, helm-solr, Mains.World, mempalace, poirocket,
  staffbase-cli, staffbase-drawer, staffbase-shoutouts, staffbase-utils, thewealthadvisor,
  verticagtm, vexa-insight-dashboard, zerohedge-mcp. Source:
  `~/p/brain/topics/supply-chain-security.md`.
- [ ] Adopt pnpm 11 supply-chain controls across `~/p` repos: `minimumReleaseAge: 1440` (24h
      cooldown defeats the compromised-token window) and `blockExoticSubdeps: true`. Needs Node 22
      and pnpm 11; check per repo. Source: `~/p/brain/topics/supply-chain-security.md`.
- [ ] Add `uv export --format requirements.txt` to any CI that adopts `uv`, as the exit ramp now
      that OpenAI owns it — one line, converts lock-in into a preference. Source:
      `~/p/brain/topics/supply-chain-security.md`.
- [ ] Run `npm pack --dry-run` before publishing any package from `~/p`: a source map with
      `sourcesContent` ships your source (that is how Claude Code's 512k-line codebase leaked).
      Source: `~/p/brain/topics/claude-code-practice.md`.

## Harness

- [ ] Dependency sweep for native replacements across the `~/p` frontends: `Intl.*` for formatting,
      `crypto.randomUUID`, `structuredClone`, `URLSearchParams`, `AbortController`. Measured
      elsewhere: audit vulnerabilities 17 -> 5. Fewer deps also shrinks the supply-chain surface.
      Source: `~/p/brain/topics/web-platform.md`.
- [ ] Decide whether to keep the `security-review` auto fan-out: measured 2026-08-13 at ~$2,691/30d
      list-price equivalent (2,324 sessions, ~77/day, Opus 4.7) with a ~1.7% candidate-flag rate and
      no confirmed real finding in the sampled verdicts. Options: keep (subscription absorbs it),
      scope to risky paths only, or disable. Numbers in `TODO_LOG.md` 2026-08-13.

## Cross-project

- [ ] `~/p/RocketUpdater` (no TODO.md there yet): commit or discard its untracked `.serena/` state —
      already named in `~/p/osseus/TODO.md`'s `.serena` entry, which can carry it; smallest action
      is closing it from the Osseus entry when either repo is next touched.
