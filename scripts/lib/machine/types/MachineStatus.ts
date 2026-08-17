export const MACHINE_STATUS = ["converged", "changed", "skipped", "needs-secret", "failed"] as const

export type MachineStatus = (typeof MACHINE_STATUS)[number]
