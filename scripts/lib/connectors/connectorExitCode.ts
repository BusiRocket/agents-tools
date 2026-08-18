import type { ProfileConnectorResult } from "./types/ProfileConnectorResult"

export const connectorExitCode = (results: ProfileConnectorResult[]): 0 | 1 =>
  results.some(
    ({ criticality, status }) =>
      criticality === "required" &&
      (status === "failed" || status === "auth-required" || status === "disabled"),
  )
    ? 1
    : 0
