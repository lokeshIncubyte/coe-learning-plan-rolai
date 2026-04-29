---
name: doc-concepts-map
description: Map framework primitives (DI, decorators, etc.) to where they live in src/.
---

# doc-concepts-map

This doc is **different from `docs/notes/`** — notes are abstract introductions; this map is *"here is exactly where this concept lives in our `src/`"* with file paths and short code excerpts.

## Inputs

- `<project>/src/` — **must contain real code**, not just scaffold defaults
- `<project>/docs/notes/` (or per-day notes) — for cross-link back to abstract intros
- `<project>/docs/spec/checklist.md` — for the Success-Criteria cross-check at the end
- **Style template:** [`day-2/picsum-lab/docs/typescript-concepts.md`](../../../day-2/picsum-lab/docs/typescript-concepts.md) — read first

## Output

`<project>/docs/<framework>-concepts-map.md` (replace `<framework>` with the actual framework name, e.g., `nestjs-concepts-map.md`, `react-concepts-map.md`).

## Steps

1. Read the style template — match its style: concept-by-concept walkthrough, each concept opens with a short prose explanation, then code excerpts (5–15 lines max) prefixed by a relative-path link to `src/`.
2. Determine the framework from `<project>/package.json` (or equivalent). Infer the canonical concept set:
   - **NestJS**: Modules, Controllers, Services, Dependency Injection, Decorators, DTOs + `class-validator`, Pipes/Guards/Interceptors *(if present)*, Testing with `@nestjs/testing`.
   - **React**: Components, Hooks (state, effect, custom), Props typing, Discriminated unions, Suspense/Error boundaries *(if present)*, Testing with `@testing-library/react`.
   - **Express**: Middleware order, Route handlers, Error handling, Request/Response typing, Testing with `supertest`.
   - **Other**: infer from the framework's docs.
3. For each concept actually present in `src/`:
   1. Short paragraph explaining what it does.
   2. One or more code excerpts pulled directly from `src/`, each prefixed by `[relative-path](path)` link.
   3. Cross-link to the abstract note in `docs/notes/` if one exists.
4. **Don't quote whole files.** Excerpts are 5–15 lines, focused on the illustrated concept.
5. **Don't list a concept that's not actually used in `src/`.** This is a *map*, not a curriculum. If `Pipes` aren't in this project, omit them.
6. End with a **Success-criteria cross-check** table mapping each item from the *Success Criteria* section of `checklist.md` to evidence in `src/` (file path + brief note). Mirrors day-2's closing table.
7. Aggregate across days: if day-3 had DI examples and day-4 added Pipes, show both. Optional closing `## Changes`.

## HITL checkpoints

- **STOP — WAIT** if `<project>/src/` doesn't exist or has only scaffold defaults — this skill needs real code. Tell the user to run `/tdd-cycle` first.
- **HUMAN TRIGGER — coverage review** after generation: confirm every expected concept is present and no unused concept was invented.

## When to run

**Last among the doc skills.** Architecture, schema, API contract, and user stories can be written as design ahead of code; this one cannot — it's purely descriptive of code that already exists. Run after Build produces enough to point at.

Re-running on each subsequent day is cheap and idempotent.
