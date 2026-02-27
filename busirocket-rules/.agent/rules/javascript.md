<!-- Antigravity Rule
Activation: Model Decision
Description: JavaScript/TypeScript domain rules (web, extensions, RN, QA, Shopify)
-->

# JavaScript Rules

Use **@javascript** when working outside strictly Next.js/React app rules or
when the project includes multiple JS/TS runtimes.

This rule references:

- **General JS/TS**: `.agent/rules/javascript/general.mdc`
- **Chrome Extensions MV3**: `.agent/rules/javascript/chrome-extension-mv3.mdc`
- **Modern web apps**: `.agent/rules/javascript/web-apps.mdc`
- **Vue + Vite** (optional): `.agent/rules/javascript/vue-vite.mdc`
- **SvelteKit** (optional): `.agent/rules/javascript/sveltekit.mdc`
- **Payload CMS + Node** (optional): `.agent/rules/integrations/payload-cms.mdc`
- **React Native/Expo**: `.agent/rules/javascript/react-native-expo.mdc`
- **Playwright QA**: `.agent/rules/javascript/playwright-qa.mdc`
- **Shopify theme JS**: `.agent/rules/javascript/shopify-theme.mdc`

## Short summary

- Security-first input handling and least privilege.
- Prefer TypeScript and explicit boundaries.
- Apply stack-specific rules only when that stack is present.