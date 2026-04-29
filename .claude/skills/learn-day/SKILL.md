---
name: learn-day
description: Write one focused note per Learn item in checklist.md.
---

# learn-day

## Inputs

- `<project>/docs/spec/checklist.md` — must have a populated *Learn* section
- (Optional) reference materials in `<project>/docs/references/` to ground notes in

## Output

- One note file per Learn item: `<project>/docs/notes/01-<kebab-topic>.md`, `02-…`, etc. (numeric prefix follows checklist order)
- The *Learn* section of `checklist.md` updated to `- [x]` with relative links to each note

## Steps

1. **STOP — WAIT** to confirm `docs/notes/` is the right destination (or accept an override).
2. Read the *Learn* section of the checklist. For each item, write a focused note:
   - One concept per file. Do not bundle.
   - Filename uses an ordering prefix (`01-…`, `02-…`) matching checklist order.
   - Body shape: open with **what it is** in plain language → **why it matters** → **concrete shape** (small code blocks or tables) → close with a **bolded key insight** sentence.
   - Aim ~70–150 lines per file. Tighter is better. No filler.
3. If a Learn item is too vague to write a note from (e.g., "Learn the framework"), pick the most useful concrete narrowing and note your interpretation at the top of the file. Don't ask — proceed and surface the choice.
4. Update the *Learn* section of `checklist.md`: each item becomes `- [x]` with a relative link to its note (e.g., `→ [`01-…md`](../notes/01-…md)`).

## HITL checkpoint

**HUMAN TRIGGER** at the end. After all notes are written and the checklist is updated, list the new note files and ask the user:

> *"Test understanding before scaffolding? Options: `quiz`, `quiz <note-file>`, `flowchart`, `mix` (interleave freely), or `skip`. The two modes have no required order — switch mid-session as useful."*

Wait for the answer; do **not** silently move on.
