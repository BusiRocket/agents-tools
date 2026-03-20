import path from "node:path"
import { HOME } from "./HOME"

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
export const CONFIG_HOME = process.env.XDG_CONFIG_HOME?.trim() || path.join(HOME, ".config")
