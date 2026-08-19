export interface GuidanceRunReport {
  ok: boolean
  runId: string
  snapshotDir: string
  errors: string[]
  warnings: string[]
}
