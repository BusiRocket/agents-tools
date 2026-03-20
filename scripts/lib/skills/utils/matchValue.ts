export const matchValue = (content: string, pattern: RegExp | string) => {
  // eslint-disable-next-line sonarjs/prefer-regexp-exec
  const match = content.match(pattern)
  return match?.[1]?.trim() ?? ""
}
