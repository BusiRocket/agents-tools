import path from "node:path"
import { HOME } from "./HOME"

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
export const CODEX_HOME = process.env.CODEX_HOME?.trim() || path.join(HOME, ".codex")
