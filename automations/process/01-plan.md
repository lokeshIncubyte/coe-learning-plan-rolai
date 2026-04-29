# Phase 1 — Plan

[← Back to index](README.md) · Next: [Phase 2 — Learn](02-learn.md)

---

## Rules

- User defines scope by handing the agent a requirements file (e.g., `requirements.md`).
- Agent reads requirements and produces structure — no installs, no commands.
- The output of this phase is a **checklist file** that becomes the source of truth for the rest of the project.
- Stop for: confirming the checklist matches the user's intent before moving on.

---

## Step 00 — Bring requirements into focus

### 00.1 Identify the requirements file

User points the agent at the canonical brief (typically `<project>/docs/spec/requirements.md`) and any sibling reference materials (PDFs, design docs).

**NO STOP** — User-only step.

### 00.2 Agent reads the requirements

**Agent prompt**
> "Go over the requirements."

The agent reads the file and any sibling reference documents. If a reference cannot be parsed (e.g., PDF tooling unavailable), the agent flags this rather than guessing — silent guesses leak into later phases.

**NO STOP** — Agent-owned.

---

## Step 01 — Convert requirements into a phased checklist

### 01.1 Pick the phase shape

The default shape — adjust per project type:

```
Learn  →  Setup  →  Build  →  Validate  →  Verify  →  Ship
```

A frontend project may insert *Style*. A library project may drop *Verify* in favor of *Document*. The shape is a planning convention; the phases are not technical contracts.

**NO STOP** — Convention-based.

### 01.2 Agent generates the checklist

**Agent prompt**
> "Help me create a checklist in an md file."

The agent must:
- Group every requirement bullet into one of the phases.
- Preserve the original *Success Criteria* list verbatim at the bottom as a final gate (so nothing from `requirements.md` is silently dropped).
- Use markdown checkboxes (`- [ ]`) so progress is visibly trackable.
- Save to `<project>/docs/spec/checklist.md`.

**Reference docs**
- `<project>/docs/spec/requirements.md`

**NO STOP** — Agent-owned.

### 01.3 User skim-reviews the checklist

User confirms:
- Every item from the requirements is represented.
- Phase ordering is reasonable.
- No invented work has been added beyond the requirements.

**STOP — WAIT** — Decision step. The agent does not enter Phase 2 until the checklist is confirmed.

---

## Runnable counterpart

The runnable automation for this phase is [`../01-requirements-to-checklist.md`](../01-requirements-to-checklist.md).

Next: [Phase 2 — Learn](02-learn.md)
