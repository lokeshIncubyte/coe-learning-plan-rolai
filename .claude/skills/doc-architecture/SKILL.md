---
name: doc-architecture
description: Generate or refine architecture.md — layers, folder tree, data flow.
---

# doc-architecture

## Inputs

- `<project>/src/` — actual code structure
- `<project>/docs/spec/checklist.md` — what's been built so far
- Per-day notes at `<project>/docs/notes/` or `<project>/docs/days/<day-N>/notes/`
- **Style template:** [`day-2/picsum-lab/docs/architecture.md`](../../../day-2/picsum-lab/docs/architecture.md) — read first

## Output

`<project>/docs/architecture.md`

## Steps

1. Read the style template — match its tone (short headings, code blocks for tree/flow diagrams, tables for responsibilities, terminal `[← Index]` link).
2. Read `<project>/src/` (Glob + Read selectively) and `<project>/docs/spec/checklist.md`.
3. Produce or refine `<project>/docs/architecture.md` with these sections in order:
   1. **Layers** — text diagram showing the request/data flow from outside to inside (e.g., `HTTP → Controller → Service → (Repository/DB)` backend, or `Components → Hooks → Domain → Infrastructure` frontend). State the rules that keep layers separated (controllers don't talk to DB; services don't read raw `Request`).
   2. **Folder structure** — `src/` tree using the project's feature/module pattern. Include only directories that exist; mark planned-but-not-built items `← (planned)`.
   3. **Module / component responsibilities** — table with one row per top-level module, *Role* column, what each owns and does *not* own.
   4. **Data flow** — text flowcharts for important runtime sequences. CRUD API: read path, write path, validation-error path. Frontend: initial load, user interaction, state persistence.
4. Tense rule:
   - If `src/` already exists → present-tense ("does", "owns").
   - If this is design ahead of Build → future-tense ("will", "should") and note at top: *"Design doc — will be refined to present-tense after Phase 5."*
5. Aggregate across days: reflect the cumulative state, not just one day's snapshot. Don't preserve day-3's old description if day-4 changed it. Optional closing `## Changes` section listing what each day added.
6. Cross-link every claim to its source file in `src/`.
7. Ignore concerns from layers this project doesn't have (no frontend talk in a backend doc).

## HITL checkpoints

- **STOP — WAIT** before overwriting an existing `architecture.md` if the diff would substantively change earlier-day claims. Surface the diff for approval.
- **HUMAN TRIGGER — review the produced doc** on first run for a new project. Read whether the layers and responsibilities match the user's mental model; let them push back.

## When to run

- After Build, before ship — doc reflects real code.
- Any subsequent day where the project's structural shape changes.
- As a design doc before Build — re-run after Build to refine to present-tense.
