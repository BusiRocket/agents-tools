import { isCapabilityTargetDetected } from "./isCapabilityTargetDetected"
import { verifyCapabilityLink } from "./verifyCapabilityLink"
import type { CapabilityTarget } from "./types/CapabilityTarget"

export const verifyCapabilityLinks = async (target: CapabilityTarget) => {
  if (target.support === "unsupported") {
    return [{ target: target.id, status: "unsupported" as const, detail: target.reason ?? "" }]
  }
  if (!(await isCapabilityTargetDetected(target))) {
    return [{ target: target.id, status: "unavailable" as const, detail: "" }]
  }

  return Promise.all(target.links.map((link) => verifyCapabilityLink(link)))
}
