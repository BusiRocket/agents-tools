import type { ConnectorDefinition } from "./types/ConnectorDefinition"
import type { ProfileConnectorResult } from "./types/ProfileConnectorResult"

export const readClaudeConnectorStatus = (
  output: string,
  profile: "claude-personal" | "claude-favish",
  definitions: ConnectorDefinition[],
): ProfileConnectorResult[] =>
  definitions
    .filter(({ profiles }) => profiles.includes(profile))
    .map((definition) => {
      const prefix =
        definition.probe === "claude-cli-prefix" ? definition.match : `${definition.match}:`
      const lines = output
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith(prefix))
      const joined = lines.join("\n")
      const boundary = definition.id === "zerohedge" ? "hosted-connector" : "client"
      if (lines.length === 0) {
        return {
          id: definition.id,
          profile,
          status: "failed",
          criticality: definition.criticality,
          boundary,
          summary: "connector is not listed",
        }
      }
      if (/needs authentication/i.test(joined)) {
        return {
          id: definition.id,
          profile,
          status: "auth-required",
          criticality: definition.criticality,
          boundary,
          summary: "authentication required",
        }
      }
      if (/disabled/i.test(joined)) {
        return {
          id: definition.id,
          profile,
          status: "disabled",
          criticality: definition.criticality,
          boundary,
          summary: "connector disabled",
        }
      }
      if (/failed to connect|HTTP\s+5\d\d|unavailable/i.test(joined)) {
        return {
          id: definition.id,
          profile,
          status: "failed",
          criticality: definition.criticality,
          boundary,
          summary: /HTTP\s+503/i.test(joined)
            ? "HTTP 503 from hosted connector"
            : "connector unavailable",
        }
      }
      if (lines.every((line) => /connected/i.test(line))) {
        return {
          id: definition.id,
          profile,
          status: "healthy",
          criticality: definition.criticality,
          boundary,
          summary: `${String(lines.length)} endpoint${lines.length === 1 ? "" : "s"} connected`,
        }
      }
      return {
        id: definition.id,
        profile,
        status: "degraded",
        criticality: definition.criticality,
        boundary,
        summary: "connector status is unrecognized",
      }
    })
