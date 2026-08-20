import outputSchema from "../../schemas/guidance-reconciliation.schema.json"
import { toGuidanceInputHashes } from "./toGuidanceInputHashes"
import type { GuidancePolicy } from "./types/GuidancePolicy"
import type { GuidanceSources } from "./types/GuidanceSources"

export const buildReconciliationPrompt = (
  policy: GuidancePolicy,
  sources: GuidanceSources,
): string =>
  JSON.stringify({
    task: "Reconcile public agent guidance without filesystem writes.",
    constraints: [
      "Retrieve current official Claude Code and Codex documentation on every run.",
      "Return only JSON conforming to the supplied output schema.",
      "Do not emit credentials, conversation captures, or paths outside the guidance surface.",
      "Translate provider syntax into documented target behavior; Codex output must not retain Claude imports.",
    ],
    requiredInvariants: policy.requiredInvariants,
    officialDocumentationOrigins: policy.officialDocumentationOrigins,
    outputSchema,
    inputHashes: toGuidanceInputHashes(sources.hashes),
    sources: sources.values,
  })
