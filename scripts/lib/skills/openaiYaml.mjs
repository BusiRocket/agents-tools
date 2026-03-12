import { promises as fs } from "node:fs"

const matchValue = (content, pattern) => {
  const match = content.match(pattern)
  return match?.[1]?.trim() ?? ""
}

const matchBoolean = (content, pattern) => {
  const value = matchValue(content, pattern)
  if (value === "true") return true
  if (value === "false") return false
  return null
}

const stripQuotes = (value) => value.replace(/^['"]|['"]$/g, "")

export const parseOpenAiYamlContent = (content) => {
  const interfaceDisplayName = stripQuotes(matchValue(content, /^\s{2}display_name:\s*(.+)\s*$/m))
  const interfaceShortDescription = stripQuotes(
    matchValue(content, /^\s{2}short_description:\s*(.+)\s*$/m),
  )
  const interfaceDefaultPrompt = stripQuotes(
    matchValue(content, /^\s{2}default_prompt:\s*(.+)\s*$/m),
  )
  const interfaceBrandColor = stripQuotes(matchValue(content, /^\s{2}brand_color:\s*(.+)\s*$/m))
  const interfaceIconSmall = stripQuotes(matchValue(content, /^\s{2}icon_small:\s*(.+)\s*$/m))
  const interfaceIconLarge = stripQuotes(matchValue(content, /^\s{2}icon_large:\s*(.+)\s*$/m))
  const allowImplicitInvocation = matchBoolean(
    content,
    /^\s{2}allow_implicit_invocation:\s*(.+)\s*$/m,
  )
  const skillClass = stripQuotes(matchValue(content, /^\s{2}skill_class:\s*(.+)\s*$/m))
  const requiresReferences = matchBoolean(content, /^\s{2}requires_references:\s*(.+)\s*$/m)
  const failureMode = stripQuotes(matchValue(content, /^\s{2}failure_mode:\s*(.+)\s*$/m))
  const toolDependencyCount = (content.match(/^\s{4}- type:\s*(.+)\s*$/gm) || []).length

  return {
    raw: content,
    interface: {
      hasSection: /^interface:\s*$/m.test(content),
      displayName: interfaceDisplayName,
      shortDescription: interfaceShortDescription,
      defaultPrompt: interfaceDefaultPrompt,
      brandColor: interfaceBrandColor,
      iconSmall: interfaceIconSmall,
      iconLarge: interfaceIconLarge,
    },
    policy: {
      hasSection: /^policy:\s*$/m.test(content),
      allowImplicitInvocation,
    },
    busirocket: {
      hasSection: /^busirocket:\s*$/m.test(content),
      skillClass,
      requiresReferences,
      failureMode,
    },
    dependencies: {
      hasSection: /^dependencies:\s*$/m.test(content),
      hasToolsSection: /^\s{2}tools:\s*$/m.test(content),
      toolDependencyCount,
    },
  }
}

export const parseOpenAiYaml = async (filePath) =>
  parseOpenAiYamlContent(await fs.readFile(filePath, "utf8"))
