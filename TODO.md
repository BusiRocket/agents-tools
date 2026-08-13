# TODO — agents-tools

> Items routed here from the `~/p` meta backlog on 2026-08-13, where they were
> tracked before this repo had a backlog of its own. Source: `~/p/TODO.md`.
> This repo owns the shared rule set and the generated agent configuration, so
> cross-repo policies land here as generated rules or hooks rather than being
> applied repo by repo.
>
> States: `[ ]` pending · `[~]` partial or unverified · `[!]` blocked · `[x]`
> verified complete · `[-]` obsolete or superseded. Closed work moves to
> `TODO_LOG.md`.

## Rules

- [ ] Staffbase rule auto-load gotcha: repos without `widget/`/`configuration/`
  markers (cli, darkmode, drawer, smart-search, global-content, search-widget,
  example-*/test-*) no longer load the rule; invoke `@staffbase` manually there
  or add `**/src/**` to its glob in `src/rules/integrations/staffbase.mdc`.
- [ ] Check whether `src/rules/react/state-management.mdc` names the Context
  subscription-granularity reason (45ms/100 components vs 2ms/3 subscribers) -
  the rule states the practice, the reason makes it stick. Source:
  `~/p/brain/topics/react-modern.md`.
- [ ] Open (or discard) the PR for the agents-tools glob narrowing: commit
  `bce0adb` sits pushed on branch `skills/deterministic-prompt-router`, never
  merged to main.
- [~] Commit or discard the pre-existing `.serena` schema migration in this
  repo. Same decision pending in Osseus and RocketUpdater.

## Supply chain and secrets

- [ ] Install `detect-secrets` as a pre-commit hook and enable GitHub secret
  scanning on the active repos. A leaked AWS key was used 11 minutes after the
  push in one documented case. Cheap, one-time. Source:
  `~/p/brain/topics/app-security.md`.
- [ ] Add a variation-selector grep to CI or a pre-commit hook for the published
  repos - `grep -rP '[\x{FE00}-\x{FE0F}\x{E0100}-\x{E01EF}]'` - GlassWorm hid
  payloads in zero-width Unicode that no diff shows. Nearly free. Source:
  `~/p/brain/topics/supply-chain-security.md`.
- [ ] Audit CI for long-lived registry publish tokens readable by third-party
  actions (the LiteLLM vector was a compromised Trivy action stealing
  `PYPI_PUBLISH`); prefer OIDC/Trusted Publishers. Source:
  `~/p/brain/topics/supply-chain-security.md`.
- [ ] Adopt pnpm 11 supply-chain controls across `~/p` repos:
  `minimumReleaseAge: 1440` (24h cooldown defeats the compromised-token window)
  and `blockExoticSubdeps: true`. Needs Node 22 and pnpm 11; check per repo.
  Source: `~/p/brain/topics/supply-chain-security.md`.
- [ ] Add `uv export --format requirements.txt` to any CI that adopts `uv`, as
  the exit ramp now that OpenAI owns it - one line, converts lock-in into a
  preference. Source: `~/p/brain/topics/supply-chain-security.md`.
- [ ] Run `npm pack --dry-run` before publishing any package from `~/p`: a source
  map with `sourcesContent` ships your source (that is how Claude Code's
  512k-line codebase leaked). Source:
  `~/p/brain/topics/claude-code-practice.md`.

## Harness

- [ ] Layer 4 gap: "success is silent, failure is loud" verification hooks (exit
  2 to re-engage) exist in `~/p/brain` as the Stop gate but not in the other
  `~/p` repos. Source: `~/p/brain/topics/agent-harnesses.md`.
- [ ] Dependency sweep for native replacements across the `~/p` frontends:
  `Intl.*` for formatting, `crypto.randomUUID`, `structuredClone`,
  `URLSearchParams`, `AbortController`. Measured elsewhere: audit vulnerabilities
  17 -> 5. Fewer deps also shrinks the supply-chain surface. Source:
  `~/p/brain/topics/web-platform.md`.
