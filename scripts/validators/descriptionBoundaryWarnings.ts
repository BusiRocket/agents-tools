export const descriptionBoundaryWarnings = (description: string) => {
  const warnings = []
  if (!/trigger when/i.test(description)) {
    warnings.push("description should include an explicit 'Trigger when ...' boundary")
  }
  if (!/do not use/i.test(description)) {
    warnings.push("description should include an explicit 'Do not use ...' boundary")
  }
  return warnings
}
