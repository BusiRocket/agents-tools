# Claude Connector Authentication

Use this runbook when `pnpm run connectors:doctor -- --json` reports `auth-required`. OAuth state is
profile-owned and must never be copied between Claude configuration roots.

## Personal profile

Close other pending MCP login prompts, then run each command from a local terminal. Complete the
browser flow using the personal account intended for this profile. Do not paste callback URLs into
logs, issues, commits, or chat transcripts.

```bash
claude mcp login plugin:cloudflare:cloudflare-api
claude mcp login plugin:cloudflare:cloudflare-bindings
claude mcp login plugin:cloudflare:cloudflare-builds
claude mcp login plugin:cloudflare:cloudflare-observability
```

Verify the same profile after each completed browser flow:

```bash
pnpm run connectors:doctor -- --profile personal --json
```

If the browser does not open, use the one-time URL printed by the CLI. If the redirect cannot reach
the local callback listener, paste the complete redirect URL only into the waiting CLI prompt. The
URL is transient authentication material and must not be stored.

### OpenSEO access gateway

Do not repeat `claude mcp login openseo` while the doctor reports the `access-gateway` boundary. On
2026-08-18, Cloudflare Access redirected `/mcp` to HTML and the OAuth attempt ended with
`invalid_target`, meaning Managed OAuth was not enabled for the MCP resource.

Enable Managed OAuth on the existing Access application while preserving every other application
field. The required configuration is:

- `oauth_configuration.enabled = true`
- `oauth_configuration.dynamic_client_registration.enabled = true`
- `oauth_configuration.dynamic_client_registration.allow_any_on_localhost = true`
- `oauth_configuration.dynamic_client_registration.allow_any_on_loopback = true`

Cloudflare requires the full current Access application configuration on update. Read the complete
application first, modify only the four fields above, and write the complete result back. The API
credential needs Access Apps and Policies Write permission. If that scope is missing, use the
Cloudflare dashboard or refresh the deployment credential with the required scope. See
[Cloudflare Managed OAuth](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/managed-oauth/).

After that policy change, verify that an unauthenticated MCP initialize request returns HTTP 401
with OAuth resource metadata instead of an HTML redirect, then run:

```bash
claude mcp login openseo
pnpm run connectors:doctor -- --profile personal --json
```

## Favish profile

Favish credentials are already profile-local. Verify them without logging out, logging in, copying
credential files, or changing the account selection:

```bash
CLAUDE_CONFIG_DIR="$HOME/.claude-favish" claude mcp list
pnpm run connectors:doctor -- --profile favish --json
```

OpenSEO is intentionally not declared for Favish and therefore remains not applicable to that
profile.

## Completion check

After all personal browser flows complete, require both profile inventories to pass:

```bash
pnpm run connectors:doctor -- --json
pnpm run agents:doctor -- --json
```

An optional hosted connector outage may remain degraded. A required connector that still needs
authentication keeps `connectors:doctor` at exit status 1.
