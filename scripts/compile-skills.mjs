import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"
import { generateBundle } from "./lib/rules/generateBundle.mjs"

const ROOT = process.cwd()
const RULES_DIR = path.join(ROOT, "src", "rules")
const SKILLS_SRC_DIR = path.join(ROOT, "src", "skills")
const SKILLS_DIST_DIR = path.join(ROOT, "dist", "skills")

const buildRulesText = (bundle) => {
  let text = `## Dynamic Rules Ecosystem\n\n`
  text += `> [!IMPORTANT]\n`
  text += `> The following rules define the coding standards for this project.\n`
  text += `> Detect the current stack based on project files (e.g., package.json, Cargo.toml) and apply the relevant rules below.\n\n`

  // Group by top-level directory (or "Global" if in root)
  const grouped = {}
  for (const item of bundle) {
    const dir = path.dirname(item.rel)
    const category = dir === "." ? "Core / Global" : dir.split(path.sep)[0]
    const catName = category.charAt(0).toUpperCase() + category.slice(1)

    if (!grouped[catName]) grouped[catName] = []
    grouped[catName].push(item)
  }

  for (const [category, items] of Object.entries(grouped).sort()) {
    text += `### ${category} Rules\n\n`
    for (const item of items) {
      const name = path.basename(item.rel, ".mdc")
      const desc = item.frontmatter.description || ""
      text += `#### Rule: \`${name}\`\n`
      if (desc) text += `*${desc}*\n\n`
      text += `${item.content}\n\n`
    }
  }

  return text
}

const copyDirRecursive = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    // Skip stacks folder entirely, it's deprecated
    if (entry.isDirectory() && entry.name === "stacks" && src === SKILLS_SRC_DIR) {
      continue
    }

    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

const processSkills = async (dir, rulesText) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await processSkills(fullPath, rulesText)
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      const content = await fs.readFile(fullPath, "utf8")
      // Check if it already has rules, to be safe, or just append
      if (!content.includes("## Dynamic Rules Ecosystem")) {
        const newContent = `${content.trimEnd()}\n\n${rulesText}`
        await fs.writeFile(fullPath, newContent, "utf8")
      }
    }
  }
}

const main = async () => {
  console.log("Compiling skills...")

  // 1. Read and parse rules
  const ruleFiles = await listFilesRecursive(RULES_DIR)
  const bundle = await generateBundle(ruleFiles, RULES_DIR)
  const rulesText = buildRulesText(bundle)

  // 2. Clear old dist/skills
  await fs.rm(SKILLS_DIST_DIR, { recursive: true, force: true })

  // 3. Copy src/skills to dist/skills (excluding 'stacks')
  await copyDirRecursive(SKILLS_SRC_DIR, SKILLS_DIST_DIR)

  // 4. Inject rules into all SKILL.md files in dist/skills
  await processSkills(SKILLS_DIST_DIR, rulesText)

  console.log(`Successfully compiled skills to ${SKILLS_DIST_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
