#!/usr/bin/env python3
"""Match a user prompt against the routing table and emit a skill directive.

Reads the UserPromptSubmit hook payload on stdin, writes hookSpecificOutput JSON
on stdout, or nothing when no route matches. Silence is the common case and
costs zero tokens.

Routing anchors on domain nouns rather than verbs. The user's imperative verbs
("mira", "haz", "dame") are too ambiguous to route on: "mira a ver si" means
investigate, "mira los mensajes de" means read comms. Nouns disambiguate.
"""

import json
import re
import sys

# Prompts that only acknowledge or resume. Routing these wastes tokens, since
# the work was already established by an earlier turn.
CONTINUATION = re.compile(
    r"^\W*(s[ií]|ok|okay|vale|dale|venga|adelante|perfecto|genial|hecho|gracias|"
    r"sigue|continu[ae]|contin[uú]a|termina|acaba|hazlo|adelante con|"
    r"sí por favor|si por favor|haz lo que|yes|go ahead|continue)\b[\s\W]*$",
    re.I,
)

# Harness-generated payloads, not user intent.
MACHINE = re.compile(r"^\W*<(task-notification|system-reminder|local-command)", re.I)

# (name, directive, pattern). First match wins, so order is priority.
ROUTES = [
    (
        "continuation",
        "Resuming earlier work. Recover state before acting: check git status, the "
        "active plan file, and what was left unfinished. Do not ask the user to "
        "repeat context they already gave.",
        r"(siguiendo (la|el|nuestra)? ?(conversaci[oó]n|sesi[oó]n|hilo)|"
        r"(la )?(conversaci[oó]n|sesi[oó]n) anterior|se qued[oó] a medias|"
        r"esto se ha quedado a medias|donde lo dejamos|"
        r"lo que (falta|queda|falte) (por )?(hacer|terminar)|"
        r"termina (lo que|los pasos)|contin[uú]a (con|donde)|"
        r"la sesi[oó]n anterior se qued)",
    ),
    (
        "invoice-ops",
        "Invoice/tax-ops context. Reconcile against the source of truth before "
        "reporting; never infer an amount or a status from stale context.",
        r"\b(factura|facturas|trimestre|iva\b|irpf|holded|movimientos|"
        r"ep[ií]grafe|hacienda|gastos? deducible|autonomo|aut[oó]nomo|"
        r"modelo 30[03]|modelo 111|cierre trimestral)\b",
    ),
    (
        "traffic-client",
        "Use the brp-traffic-client skill: turn the captured traffic into a "
        "direct HTTP client instead of driving the browser.",
        r"\b(\.har\b|\bhar\b|har file|copy as fetch|copy as curl|devtools network|"
        r"network tab|cdp\b|proxy capture|playwright|puppeteer)\b",
    ),
    (
        "stakeholder-recap",
        "Stakeholder-comms context. Read the channel history first, cross-check "
        "claims against commits, and do not restate what was already sent.",
        r"\b(discord|slack)\b.{0,60}\b(recap|resumen|mensajes|dice|dijo|"
        r"responder|contestar|update)\b|"
        r"\b(recap|resumen)\b.{0,40}\b(discord|slack|nathan|john)\b",
    ),
    (
        "debug",
        "Use the superpowers:systematic-debugging skill before proposing a fix. "
        "Reproduce first; do not guess at the cause.",
        r"\b(no funciona|no va\b|sigue (sin|igual|fallando|roto)|falla|fallando|"
        r"est[aá] roto|se ha roto|has roto|crashe|petado|se cuelga|"
        r"no carga|no aparece|no sale|no me deja|da error|sale un error|"
        r"sale[n]? mal|aparece[n]? mal|se ve[n]? mal|"
        r"el ci .{0,20}falla|tarda much[oí]simo|se queda (lag|colgad|pillad))\b",
    ),
    (
        "release",
        "Use the brp-release skill: collect commits since the last tag, pick the "
        "semver bump, update changelog, gate on a green check, then tag.",
        r"\b(changelog|release notes|haz(me)? (un|el) release|"
        r"sube la versi[oó]n|bump|semver|taggea|crea (el|un) tag)\b",
    ),
    (
        "docs",
        "Use the brp-docs skill: write for a future reader who lacks this "
        "session's context.",
        r"\b(readme|documenta(ci[oó]n)?|\badr\b|architecture decision|"
        r"escribe (los|las) docs|documenta esto)\b",
    ),
    (
        "frontend",
        "Use the frontend-design skill. Match the existing design system; check "
        "the rendered result rather than assuming the markup is right.",
        r"\b(tailwind|\bcss\b|layout|responsive|se ve (mal|raro|feo|fatal)|"
        r"el dise[ñn]o|la interfaz|\bui\b|landing|maquet|en m[oó]vil|"
        r"scroll|padding|margin|z-index)\b",
    ),
    (
        "plan",
        "Use superpowers:brainstorming, then superpowers:writing-plans. Do not "
        "start editing before the approach is agreed.",
        r"\b(hazme un plan|haz un plan|dame un plan|crea(r)? un plan|"
        r"necesito un plan|roadmap|c[oó]mo lo (har[ií]as|enfocar[ií]as)|"
        r"antes de implementar|planifica)\b",
    ),
]

COMPILED = [(name, directive, re.compile(pat, re.I)) for name, directive, pat in ROUTES]

# Several asks in one message: the tail reliably gets dropped.
MULTI_VERB = re.compile(
    r"\b(revisa|mira|arregla|haz|hazme|crea|a[ñn]ade|implementa|pon|dame|busca|"
    r"comprueba|prueba|actualiza|cambia|mueve|borra|documenta|sube|genera|"
    r"termina|conecta|descarga|instala|configura|sincroniza|limpia)\b",
    re.I,
)


def build_context(prompt):
    if MACHINE.match(prompt) or CONTINUATION.match(prompt.strip()):
        return None

    notes = []
    for _name, directive, pattern in COMPILED:
        if pattern.search(prompt):
            notes.append(directive)
            break

    if len(set(m.lower() for m in MULTI_VERB.findall(prompt))) >= 3:
        notes.append(
            "This prompt contains several separate asks. Track them as tasks and "
            "confirm every one is done before finishing."
        )

    return " ".join(notes) if notes else None


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return
    prompt = payload.get("prompt") or ""
    if not prompt.strip():
        return

    context = build_context(prompt)
    if not context:
        return

    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "UserPromptSubmit",
                "additionalContext": context,
            }
        },
        sys.stdout,
    )


if __name__ == "__main__":
    main()
