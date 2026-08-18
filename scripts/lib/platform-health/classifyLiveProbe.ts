import type { CapabilityStatus } from "./types/CapabilityStatus"

export const classifyLiveProbe = (
  output: string,
  exitCode: number | null,
  timedOut: boolean,
): CapabilityStatus => {
  if (timedOut) return "failed"
  if (/needs authentication|signed.?out|authentication required/i.test(output)) {
    return "auth-required"
  }
  if (/failed to connect|disconnected|unavailable/i.test(output)) return "degraded"
  return exitCode === 0 ? "healthy" : "failed"
}
