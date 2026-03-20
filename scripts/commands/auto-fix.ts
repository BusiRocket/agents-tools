import { Project, SyntaxKind } from "ts-morph"

const project = new Project({ tsConfigFilePath: "tsconfig.json" })

for (const sf of project.getSourceFiles()) {
  let changed = false
  // Fix 1: @typescript-eslint/restrict-template-expressions
  for (const templateSpan of sf.getDescendantsOfKind(SyntaxKind.TemplateSpan)) {
    const expr = templateSpan.getExpression()
    const type = expr.getType()
    if (type.isAny() || type.isUnknown() || type.isIntersection() || type.isUnion()) {
      // If it's a simple identifier, wrap in String()
      if (
        expr.getKind() === SyntaxKind.Identifier ||
        expr.getKind() === SyntaxKind.PropertyAccessExpression ||
        expr.getKind() === SyntaxKind.ElementAccessExpression ||
        expr.getKind() === SyntaxKind.CallExpression
      ) {
        if (!expr.getText().startsWith("String(")) {
          expr.replaceWithText(`String(${expr.getText()})`)
          changed = true
        }
      }
    }
  }

  // Fix 2: @typescript-eslint/no-explicit-any
  for (const anyKw of sf.getDescendantsOfKind(SyntaxKind.AnyKeyword)) {
    anyKw.replaceWithText("unknown")
    changed = true
  }

  if (changed) {
    sf.saveSync()
  }
}
console.log("Auto-fix complete.")
