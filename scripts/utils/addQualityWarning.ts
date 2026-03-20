export const addQualityWarning = (
  quality: { warnings: string[]; score: number },
  warning: string,
  penalty = 5,
) => {
  quality.warnings.push(warning)
  quality.score = Math.max(0, quality.score - penalty)
}
