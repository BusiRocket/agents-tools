<!-- Antigravity Rule
Activation: Model Decision
Description: State management (Zustand) - when to use stores vs props, modal pattern
-->

# State Management (Zustand)

Apply when the project uses Zustand (or a similar store) for shared UI state.

## When to Use a Store

- Modal visibility states (settings, dialogs, panels)
- Global UI state
- Shared data across unrelated components
- Cross-component communication without prop drilling

## Avoid Prop Drilling

```tsx
// BAD: Prop drilling
;<Parent onOpenModal={setIsOpen}>
  <Child onOpenModal={onOpenModal} />
</Parent>

// GOOD: Store access
const openModal = useUiStore((state) => state.openModal)
```

## Modal Pattern

Modals should read their visibility state from the store directly, not receive it as props:

```tsx
export function SettingsModal() {
  const isOpen = useUiStore((state) => state.isSettingsModalOpen)
  const closeModal = useUiStore((state) => state.closeSettingsModal)
  // ...
}
```

## Aggregate Hooks

Consider aggregate hooks to reduce store coupling when many components need related state slices.