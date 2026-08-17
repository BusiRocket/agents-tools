export const looksLikeListingArtifact = (counts: Record<string, number>) => {
  const values = Object.values(counts).filter((count) => count > 1)

  if (values.length < 10) {
    return false
  }

  const buckets: Record<number, number> = {}

  for (const value of values) {
    buckets[value] = (buckets[value] ?? 0) + 1
  }

  const largest = Math.max(...Object.values(buckets))

  return largest / values.length >= 0.2
}
