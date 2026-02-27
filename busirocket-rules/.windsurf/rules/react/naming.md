---
description: "React naming conventions for handlers, booleans, and hooks"
alwaysApply: true
priority: high
---

# React Naming

## Handlers

- Event handlers must start with `handle`:
  - `handleClick`
  - `handleSubmit`
  - `handleKeyDown`

## Booleans

- Use auxiliary-verb names:
  - `isLoading`
  - `hasError`
  - `canSubmit`
  - `shouldRetry`

## Hooks

- Hooks must start with `use`:
  - `useAuth`
  - `useFormState`
  - `useUserSettings`