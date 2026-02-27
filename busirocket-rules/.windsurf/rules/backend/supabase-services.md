---
description: "Supabase services usage (only if Supabase is added)"
alwaysApply: false
priority: high
---

# Supabase Services Usage

## Rule

This rule only applies if/when this repository adds Supabase.

- Route handlers, hooks, utils, and components must NOT call Supabase directly.
- Centralize reads/writes in `services/supabase/` modules.
- Never import `@supabase/supabase-js` outside the Supabase client setup or `services/supabase/*`.