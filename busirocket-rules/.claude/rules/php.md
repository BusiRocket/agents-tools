# PHP Rules

Use **@php** when working on PHP codebases.

This rule references:

- **General PHP**: `.cursor/rules/php/general.mdc` - baseline language, architecture, security, testing
- **Laravel**: `.cursor/rules/php/laravel.mdc` - Laravel service/container, validation, queues, policies
- **Laravel + Livewire** (optional): `.cursor/rules/php/laravel-livewire.mdc` - Livewire components, UX feedback, component boundaries
- **Laravel + Vue** (optional): `.cursor/rules/php/laravel-vue.mdc` - Inertia/SPA boundaries, API contracts, frontend-state discipline
- **WordPress**: `.cursor/rules/php/wordpress.mdc` - WP APIs, nonces/capabilities, escaping/sanitization
- **WooCommerce** (optional): `.cursor/rules/php/woocommerce.mdc` - WC hooks, CRUD/data stores, notices, sessions, webhooks
- **Drupal**: `.cursor/rules/php/drupal.mdc` - Drupal services, Form API, cache metadata, module patterns

## Short summary

- Keep entry layers thin, move business logic to services.
- Validate at boundaries, escape at output boundaries.
- Prefer framework-native APIs over custom plumbing.
