import path from "node:path"
import { HOME } from "./HOME"

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
export const CLAUDE_HOME = process.env.CLAUDE_CONFIG_DIR?.trim() || path.join(HOME, ".claude")
