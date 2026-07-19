/**
 * Distinctive substring each router lane must inject. Matching on a marker keeps
 * the test tied to which skill is summoned rather than to exact wording.
 */
export const LANE_MARKERS: Record<string, string> = {
  "invoice-ops": "invoice-quarter-close",
  debug: "systematic-debugging",
  frontend: "frontend-design",
  continuation: "Resuming earlier work",
  "stakeholder-recap": "Stakeholder-comms",
  "traffic-client": "brp-traffic-client",
}
