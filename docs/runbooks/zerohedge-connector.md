# ZeroHedge Connector Boundary Runbook

Use this runbook when Claude reports `HTTP 503` for the hosted ZeroHedge connector. Do not increase
timeouts: the observed failure is immediate and occurs before tool execution.

## Safe checks

Run the repository probe. It reads `/healthz`, performs an unauthenticated MCP initialize request,
and returns only status, boundary, timing, HTTP status, and a safe summary:

```bash
pnpm exec tsx -e 'import { probeZeroHedgeBoundary } from "./scripts/lib/connectors/probeZeroHedgeBoundary.ts"; void probeZeroHedgeBoundary("https://mcp.zerohedge.net").then((result) => console.log(JSON.stringify(result, null, 2)))'
```

Check TLS and DNS without printing response bodies:

```bash
curl -sS -o /dev/null -w 'http=%{http_code} tls=%{ssl_verify_result} time=%{time_total}\n' --max-time 10 https://mcp.zerohedge.net/healthz
dig +short mcp.zerohedge.net A
openssl s_client -connect mcp.zerohedge.net:443 -servername mcp.zerohedge.net -verify_return_error </dev/null
```

Compare the DNS result with the production ingress address using the intended Kubernetes context:

```bash
kubectl --context gke_favish-general_us-central1-a_ai-cluster -n zh-mcp get ingress zh-mcp-server -o wide
kubectl --context gke_favish-general_us-central1-a_ai-cluster -n zh-mcp get certificate,certificaterequest,order
kubectl --context gke_favish-general_us-central1-a_ai-cluster -n zh-mcp get pods,service,endpoints -o wide
```

## Observed boundary on 2026-08-18

- The hosted Claude connector returned HTTP 503 for both Claude profiles.
- Normal TLS validation for `mcp.zerohedge.net` failed because DNS reached an ingress presenting the
  Kubernetes fake self-signed certificate.
- The production certificate resource in the intended cluster was ready, and the service had a ready
  pod and endpoint.
- The public DNS address did not equal the intended production ingress address.
- The dev hostname had a valid certificate, but its MCP service had no ready endpoint and returned
  HTTP 503.

This evidence places the production failure at DNS/ingress routing, before the ZeroHedge MCP
application. A code change or timeout increase cannot repair it.

## Repair and verification

Changing public DNS or applying Kubernetes manifests is a production mutation. Obtain the
repository-required deployment approval, then point the production hostname at the intended ingress
and wait for DNS propagation. Do not replace the ready certificate secret or copy credentials.

After the approved infrastructure change, rerun every safe check above, then verify both profiles:

```bash
claude mcp list
CLAUDE_CONFIG_DIR="$HOME/.claude-favish" claude mcp list
pnpm run connectors:doctor -- --json
```

Success means TLS verification is clean, `/healthz` is HTTP 200, the unauthenticated MCP request
reaches the OAuth boundary, and the hosted connector no longer reports an unexplained 503.
