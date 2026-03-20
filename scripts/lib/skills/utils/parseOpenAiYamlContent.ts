import { matchBoolean } from "./matchBoolean"
import { matchValue } from "./matchValue"
import { stripQuotes } from "./stripQuotes"

export const parseOpenAiYamlContent = (content: string) => {
  // eslint-disable-next-line sonarjs/slow-regex
  const interfaceDisplayName = stripQuotes(matchValue(content, /^\s{2}display_name:\s*(.+)\s*$/m))
  const interfaceShortDescription = stripQuotes(
    // eslint-disable-next-line sonarjs/slow-regex
    matchValue(content, /^\s{2}short_description:\s*(.+)\s*$/m),
  )
  const interfaceDefaultPrompt = stripQuotes(
    // eslint-disable-next-line sonarjs/slow-regex
    matchValue(content, /^\s{2}default_prompt:\s*(.+)\s*$/m),
  )
  // eslint-disable-next-line sonarjs/slow-regex
  const interfaceBrandColor = stripQuotes(matchValue(content, /^\s{2}brand_color:\s*(.+)\s*$/m))
  // eslint-disable-next-line sonarjs/slow-regex
  const interfaceIconSmall = stripQuotes(matchValue(content, /^\s{2}icon_small:\s*(.+)\s*$/m))
  // eslint-disable-next-line sonarjs/slow-regex
  const interfaceIconLarge = stripQuotes(matchValue(content, /^\s{2}icon_large:\s*(.+)\s*$/m))
  const allowImplicitInvocation = matchBoolean(
    content,
    // eslint-disable-next-line sonarjs/slow-regex
    /^\s{2}allow_implicit_invocation:\s*(.+)\s*$/m,
  )
  // eslint-disable-next-line sonarjs/slow-regex
  const skillClass = stripQuotes(matchValue(content, /^\s{2}skill_class:\s*(.+)\s*$/m))
  // eslint-disable-next-line sonarjs/slow-regex
  const requiresReferences = matchBoolean(content, /^\s{2}requires_references:\s*(.+)\s*$/m)
  // eslint-disable-next-line sonarjs/slow-regex
  const failureMode = stripQuotes(matchValue(content, /^\s{2}failure_mode:\s*(.+)\s*$/m))
  // eslint-disable-next-line sonarjs/slow-regex, @typescript-eslint/prefer-nullish-coalescing
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
