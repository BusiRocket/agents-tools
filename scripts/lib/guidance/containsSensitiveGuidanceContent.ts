export const containsSensitiveGuidanceContent = (value: string): boolean => {
  const lower = value.toLowerCase()
  return (
    (value.includes("-----BEGIN ") && value.includes("PRIVATE KEY-----")) ||
    /\bsk-[A-Za-z0-9_-]{12,}/u.test(value) ||
    ["api_key", "api-key", "token", "secret", "password", "authorization"].some(
      (label) => lower.includes(`${label}=`) || lower.includes(`${label}:`),
    ) ||
    value
      .split("\n")
      .some(
        (line) =>
          line.trimStart().startsWith('{"type":"session_meta"') ||
          line.trimStart().startsWith('{"type":"event_msg"'),
      )
  )
}
