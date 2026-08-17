const TRANSPORT_WORDS = new Set(["stdio", "http", "sse"])
const SUSPICIOUS_PREFIX = /^(ghp_|gho_|github_pat_|sk-|ctx7sk-|fc-|xox[baprs]-|eyJ)/
const USERINFO_URL = /^[a-z][a-z0-9+.-]*:\/\/[^/@\s]+@/i
const HIGH_ENTROPY = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9_-]{24,}/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isAllowedLiteral = (value: string) => {
  if (SUSPICIOUS_PREFIX.test(value) || USERINFO_URL.test(value) || UUID.test(value)) {
    return false
  }

  if (value.startsWith("-") || TRANSPORT_WORDS.has(value)) {
    return true
  }

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return true
  }

  return !HIGH_ENTROPY.test(value)
}
