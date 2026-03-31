export interface QualityEntry {
  name: string
  relativePath: string
  skillClass?: string
  score: number | string
  warnings: string[]
}
