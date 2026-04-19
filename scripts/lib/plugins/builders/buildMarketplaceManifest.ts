import type { MarketplaceManifest } from "../types/MarketplaceManifest"
import type { PluginManifest } from "../types/PluginManifest"

export const buildMarketplaceManifest = (plugin: PluginManifest): MarketplaceManifest => ({
  name: "busirocket",
  description:
    "BusiRocket plugin marketplace. Host of busirocket-agents: a BRP workflow skill pack for planning, implementing, refactoring, testing, reviewing, debugging, and documenting code across TypeScript and Next.js projects.",
  owner: { name: "BusiRocket", url: "https://github.com/BusiRocket" },
  plugins: [
    {
      name: plugin.name,
      source: ".",
      description: plugin.description,
      version: plugin.version,
      author: { name: plugin.author.name },
      ...(plugin.license ? { license: plugin.license } : {}),
      ...(plugin.keywords ? { keywords: plugin.keywords } : {}),
    },
  ],
})
