# ADR 0001: Name the Repository Family Rocket Agents

- Status: Accepted
- Date: 2026-08-19

## Context

The agent environment depends on several repositories whose names predate their current roles.
`agents-tools` is a control plane but still identifies itself as `busirocket-agents-tools` in some
metadata. The repository checked out at `~/.agents` is named `claude-skills` even though it feeds
many agent clients. `ai-state` describes an older memory and conversation transport that overlaps
with the safe conversation synchronizer and MemPalace.

Giving every dependency the same prefix would hide real ownership boundaries. `dotfiles` manages the
whole host, `brain` is a human knowledge vault, and `mempalace` is an upstream project with a local
fork. Those repositories are dependencies of the agent platform, not components that should be
renamed to look internal.

## Decision

The umbrella product name is **Rocket Agents**.

BRP remains the workflow engine and protocol inside Rocket Agents. It is not the umbrella name.

Repository names owned exclusively by the platform follow this rule:

```text
rocket-agents[-<single-capability>]
```

The root control plane needs no capability suffix. A separately deployable or independently
versioned component uses one concrete capability noun, such as `library`. Names based on a vendor,
implementation language, machine, or temporary transport are not used.

## Repository map

| Current repository                        | Canonical role                                                                      | Target name                        | Decision                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------- |
| `BusiRocket/agents-tools`                 | Public control plane: policy, manifests, adapters, diagnostics, and synchronization | `BusiRocket/rocket-agents`         | Coordinated rename later                            |
| `BusiRocket/claude-skills` at `~/.agents` | Private curated skill library consumed by multiple clients                          | `BusiRocket/rocket-agents-library` | Coordinated rename later                            |
| `BusiRocket/dotfiles`                     | Private host bootstrap and machine-specific instance data                           | `BusiRocket/dotfiles`              | Keep                                                |
| `CristianDeluxe/brain`                    | Human-authored personal knowledge and operational source material                   | `CristianDeluxe/brain`             | Keep                                                |
| `CristianDeluxe/mempalace-fork`           | Search/index runtime derived from source material and conversations                 | `CristianDeluxe/mempalace-fork`    | Keep upstream identity                              |
| `BusiRocket/ai-state`                     | Legacy snapshot transport                                                           | None                               | Preserve Git history, retire from active automation |

## Ownership boundaries

- Rocket Agents owns executable agent policy, cross-client adapters, health checks, and safe
  conversation transport.
- `dotfiles` installs the host and supplies private machine instance data. It may call Rocket
  Agents, but it does not implement agent orchestration.
- The library owns curated skill source and provenance. Generated client links are not source.
- `brain` owns deliberate human knowledge. It is never treated as generated runtime state.
- MemPalace indexes data. Its live database is derived, machine-local state and is never mirrored
  byte for byte.
- Authentication, Keychain records, tokens, and client databases remain local to each machine.

## Migration policy

Repository renames are one coordinated migration, not piecemeal edits. Before changing a GitHub
name, inventory remote URLs, clone paths, package metadata, plugin namespaces, documentation links,
and scheduled jobs. Keep compatibility wrappers for one migration window, then remove them in a
separate verified change.

Until that migration is executed, current clone paths and plugin namespaces remain valid. New
documentation uses the Rocket Agents product name and the current repository slug where a literal
path or URL is required.

## Verification

The following commands verify the current boundaries without changing machine state:

```bash
git remote get-url origin
pnpm run machine:diff -- --json
~/p/dotfiles/bin/sync-conversations macmini dry
```

Expected results are the current `BusiRocket/agents-tools` remote, zero managed machine changes, and
a conversation preview that excludes credentials, SQLite databases, and MemPalace storage.

## Consequences

- Users get one stable name for the complete system and one distinct name for its workflow engine.
- Future platform repositories have a predictable, capability-based name.
- Existing external-purpose repositories keep honest names and ownership.
- Two GitHub renames remain intentionally deferred until every compatibility surface can move
  together.
