import { selectFannedOutSkills } from "../selectFannedOutSkills"
import { proposeForProcedure } from "./proposeForProcedure"
import { proposeIdleParking } from "./proposeIdleParking"
import type { Proposal } from "./types/Proposal"
import type { ProposeChangesInput } from "./types/ProposeChangesInput"

export const proposeChanges = ({
  procedures,
  manifest,
  invocations,
  target,
}: ProposeChangesInput): Proposal[] => {
  const fannedOut = selectFannedOutSkills(manifest, target)
  const proposals: Proposal[] = []

  for (const procedure of procedures) {
    const proposal = proposeForProcedure(procedure, manifest, fannedOut, invocations)
    if (proposal !== undefined) {
      proposals.push(proposal)
    }
  }

  proposals.push(...proposeIdleParking(fannedOut, procedures, invocations))

  return proposals.toSorted((left, right) => right.requests - left.requests)
}
