import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Router fixtures loaded from src/hooks/router-fixtures.json. Every prompt there
 * is copied verbatim from a real transcript.
 */
export const ROUTER_FIXTURES = JSON.parse(
  readFileSync(
    path.join(
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../.."),
      "src/hooks/router-fixtures.json",
    ),
    "utf8",
  ),
) as {
  routes: Record<string, string[]>
  silent: { prompts: string[] }
}
