import { FRONTMATTER_RE } from "../constants/FRONTMATTER_RE"

export const replaceFrontmatter = (content: string, nextFrontmatter: string) => {
  // eslint-disable-next-line sonarjs/prefer-regexp-exec
  const match = content.match(FRONTMATTER_RE)
  if (!match) {
    return `---\n${nextFrontmatter}\n---\n\n${content.trimStart()}`
  }

  return content.replace(FRONTMATTER_RE, `---\n${nextFrontmatter}\n---`)
}
