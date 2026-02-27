<!-- Antigravity Rule
Activation: Model Decision
Description: Python schema-driven development and UV
-->

# Python Rules

Use **@python** when working on Python code.

This rule references:

- **Python standards**: `.agent/rules/python/python.mdc` — schema-first, UV, type hints, structure, testing, packaging
- **Django** (optional): `.agent/rules/python/django.mdc` — app structure, ORM-first, MVT boundaries, security
- **Django REST API** (optional): `.agent/rules/python/django-rest-api.mdc` — DRF serializers/views, versioning, pagination, error shape

## Short summary

- Schema first; UV for venv and packages (uv venv, uv pip sync/compile); strict pinning; type hints and validation.
