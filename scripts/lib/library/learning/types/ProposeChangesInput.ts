import type { CurationManifest } from "../../types/CurationManifest"
import type { Procedure } from "./Procedure"

export interface ProposeChangesInput {
  procedures: Procedure[]
  manifest: CurationManifest
  invocations: Record<string, number>
  target: string
}
