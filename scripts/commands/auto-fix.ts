import { Project, SyntaxKind } from "ts-morph"

const project = new Project({ tsConfigFilePath: "tsconfig.json" })

const sourceFiles = project.getSourceFiles().filter((f) => f.getFilePath().includes("scripts/"))

for (const sourceFile of sourceFiles) {
  // Find all parameters
  const params = sourceFile.getDescendantsOfKind(SyntaxKind.Parameter)

  for (const param of params) {
    if (!param.getTypeNode()) {
      const name = param.getName()
      // Destructured parameter like `{ hasSkillMd }`
      if (param.getNameNode().getKind() === SyntaxKind.ObjectBindingPattern) {
        param.setType("Record<string, unknown>")
        continue
      }

      if (
        name === "opts" ||
        name === "options" ||
        name === "manifest" ||
        name === "content" ||
        name === "result" ||
        name === "data" ||
        name === "bundle" ||
        name === "frontmatter" ||
        name === "parsed" ||
        name === "item"
      ) {
        param.setType("Record<string, unknown>")
      } else if (
        name === "args" ||
        name === "rules" ||
        name === "skillPaths" ||
        name === "skillNames" ||
        name === "sourceFiles" ||
        name === "groups" ||
        name === "entries"
      ) {
        param.setType("string[]")
      } else if (
        name === "err" ||
        name === "error" ||
        name === "e" ||
        name === "a" ||
        name === "b" ||
        name === "left" ||
        name === "right"
      ) {
        param.setType("unknown")
      } else if (name === "i" || name === "max" || name === "priority" || name === "index") {
        param.setType("number")
      } else if (
        name === "getExtraFrontmatter" ||
        name === "getRuleRef" ||
        name === "getRuleBadges" ||
        name === "getOneLineDesc"
      ) {
        param.setType("(...args: unknown[]) => unknown")
      } else {
        param.setType("string")
      }
    }
  }

  // Find all catch clauses
  const catchClauses = sourceFile.getDescendantsOfKind(SyntaxKind.CatchClause)
  for (const clause of catchClauses) {
    const varDecl = clause.getVariableDeclaration()
    if (varDecl && !varDecl.getTypeNode()) {
      varDecl.setType("unknown")
    }
  }
}

project.saveSync()
console.log("Types auto-fixed pass 2.")
