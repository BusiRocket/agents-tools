# Anti-Patterns (avoid)

These patterns destroy agent context quality and make refactors risky.

## File Structure

- **Multiple exports per file** (any combination of component/hook/function/type).
- **Barrel/index files** (`index.ts`) that hide dependencies.
- **Growing "misc" modules** (`helpers.ts`, `utils.ts`, `types.ts`, `constants.ts`).
- **God functions** that fetch/read/parse/transform/branch in one place instead of being split into single-purpose helpers.
- **TODO/placeholders** in delivered code.

## Types

- **Inline types** in components/hooks/utils/services/route handlers.
- **One huge type file** that becomes a dumping ground.

## React

- **Fetching/DB calls inside components**.
- **Helpers inside components/hooks** (formatting, parsing, mapping) instead of `utils/`.
- Marking a whole subtree `'use client'` just to use one hook; prefer smaller client islands.
- **Prop drilling** when a store would be cleaner for shared state.
- **useState for modal visibility** when multiple components need to toggle it; prefer a store.

## App Router / API

- **Fat route handlers** that contain business logic.
- Returning unvalidated input; always validate and return explicit responses.

## Dependencies

- Adding a new dependency without first checking whether the repo already has one that solves the same problem.
- Rebuilding complex systems in-house when a mature library is the better engineering choice.
