export interface SkillReport {
  name: string
  relativePath: string
  classification: string
  frontmatterFields: string[]
  hasOpenAiYaml: boolean
  hasLegacyInlineRules: boolean
}
