<!-- Antigravity Rule
Activation: Model Decision
Description: PHP standards (general + Laravel + WordPress + Drupal)
-->

# PHP Rules

Use **@php** when working on PHP codebases.

This rule references:

- **General PHP**: `.agent/rules/php/general.mdc` - baseline language, architecture, security, testing
- **Laravel**: `.agent/rules/php/laravel.mdc` - Laravel service/container, validation, queues, policies
- **Laravel + Livewire** (optional): `.agent/rules/php/laravel-livewire.mdc` - Livewire components, UX feedback, component boundaries
- **Laravel + Vue** (optional): `.agent/rules/php/laravel-vue.mdc` - Inertia/SPA boundaries, API contracts, frontend-state discipline
- **WordPress**: `.agent/rules/php/wordpress.mdc` - WP APIs, nonces/capabilities, escaping/sanitization
- **WooCommerce** (optional): `.agent/rules/php/woocommerce.mdc` - WC hooks, CRUD/data stores, notices, sessions, webhooks
- **Drupal**: `.agent/rules/php/drupal.mdc` - Drupal services, Form API, cache metadata, module patterns

## Short summary

- Keep entry layers thin, move business logic to services.
- Validate at boundaries, escape at output boundaries.
- Prefer framework-native APIs over custom plumbing.
