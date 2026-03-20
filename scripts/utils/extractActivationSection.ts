export const extractActivationSection = (
  description: string,
  startPattern: string | RegExp,
  endPattern: string | RegExp,
) => {
  // eslint-disable-next-line sonarjs/prefer-regexp-exec
  const match = description.match(startPattern)
  if (!match) return ""
  const start = (match.index ?? 0) + match[0].length
  // eslint-disable-next-line sonarjs/prefer-regexp-exec
  const endMatch = description.slice(start).match(endPattern)
  const end = endMatch ? start + (endMatch.index ?? 0) : description.length
  return description.slice(start, end).trim()
}
