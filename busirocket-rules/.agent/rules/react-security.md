<!-- Antigravity Rule
Activation: Model Decision
Description: React UI security baseline (XSS and untrusted HTML)
-->

# React Security

## Untrusted content

- Treat UI-rendered external content as untrusted.
- Avoid `dangerouslySetInnerHTML` unless explicitly required.

## Sanitization

- If rendering untrusted HTML is required, sanitize it first with a reviewed sanitizer.
- If DOMPurify already exists in the repo, prefer it for HTML sanitization.

## Client-side secrets

- Do not embed private secrets, tokens, or internal credentials in client code.