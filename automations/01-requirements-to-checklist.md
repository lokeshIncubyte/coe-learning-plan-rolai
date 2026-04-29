# 01 — Requirements → Checklist

Take an unstructured `requirements.md` and produce a phased, trackable `checklist.md`.

---

## When to run

At the very start of a project (or a new day's contribution to an existing project). The checklist becomes the source of truth that drives every subsequent automation.

## Inputs

- A `requirements.md` file (typically at `<project-path>/docs/spec/requirements.md` or a fresh day's incoming brief)
- Any sibling reference materials (PDFs, design docs) the agent should read for context

## Outputs

- `<project-path>/docs/spec/checklist.md` (or `<project-path>/docs/days/<day-N>/spec/checklist.md` for multi-day extensions)

## Prompt (paste into a fresh agent session)

> Read `<project-path>/docs/spec/requirements.md` and any sibling reference files in the same folder. Then write a phased checklist at `<project-path>/docs/spec/checklist.md` (use `docs/days/<day-N>/spec/checklist.md` if this is a multi-day extension).
>
> Phase shape — adjust per project type but default to:
> ```
> Learn  →  Setup  →  Build  →  Validate  →  Verify  →  Ship
> ```
> A frontend project may insert *Style*. A library project may drop *Verify* in favor of *Document*. Pick what fits the brief.
>
> Hard rules:
> - Group every requirement bullet into exactly one phase. Nothing dropped, nothing duplicated.
> - Use markdown checkboxes (`- [ ]`) so progress is visible.
> - Preserve the original *Success Criteria* list (if present in the requirements) verbatim at the bottom under a clearly marked `## Success Criteria (from requirements)` heading. This is the final gate.
> - Heading style: `## 1. Learn — concepts before code`, etc. — phase number, name, short tagline.
> - Don't invent work the requirements don't ask for. If the requirements are silent on validation, don't add a Validate phase.
>
> When done, briefly summarize how each requirement bullet maps to the chosen phases so I can spot anything misplaced.

## Verification

After the agent finishes:
1. Skim each phase — does the ordering let you do them in sequence without backtracking?
2. Confirm every bullet from `requirements.md` is represented somewhere.
3. Confirm Success Criteria list is preserved at the bottom.

## Common adjustments

- **Library / package projects** — replace *Verify* with *Document* (publishable docs).
- **Frontend projects** — insert *Style* between *Build* and *Validate*.
- **Migration / refactor projects** — replace *Build* with *Migrate*, add a *Rollback plan* phase.

## Cross-links

- Methodology context: [`process/01-plan.md`](process/01-plan.md) — Phase 1 (Plan)
- Next step: [`02-checklist-to-notes.md`](02-checklist-to-notes.md)
