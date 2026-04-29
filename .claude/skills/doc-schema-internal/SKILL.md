---
name: doc-schema-internal
description: Generate schema-internal.md — entities, DTOs, enums, store shapes.
---

# doc-schema-internal

## Inputs

- `<project>/src/` — especially `entities/`, `dto/`, `model/`, `types/` (or equivalent)
- `<project>/docs/spec/checklist.md`
- **Style template:** [`day-2/picsum-lab/docs/schema-app.md`](../../../day-2/picsum-lab/docs/schema-app.md) — read first

## Output

`<project>/docs/schema-internal.md`

## Steps

1. Read the style template — match its style (typed code blocks per shape, brief prose between, closing *Cross-cutting implementation notes* section).
2. Read `<project>/src/` to discover real types.
3. Produce or refine `schema-internal.md` covering, in order:
   1. **Enums / literal unions** — status enums, kind discriminants. State whether string-typed or integer-typed and why.
   2. **Domain entities** — canonical types (e.g., `Task`, `User`). Field names + types. Mark server-generated vs. client-provided fields.
   3. **DTOs (input shapes)** — classes used for incoming requests. Show validation decorators (`@IsString`, `@IsOptional`). Note why DTOs are classes not interfaces (if validation requires class-level metadata).
   4. **DTOs (output shapes)** — only if different from the entity (redacted, derived).
   5. **Persistence store shape** — array/map/repository the service holds. State whether throwaway ("in-memory; replaced by DB in day-N") or persistent.
   6. **Type guards / validators** — only those that exist. Don't invent.
4. End with **Cross-cutting implementation notes** — whatever is true for this project (`ValidationPipe` globally with `whitelist: true`; IDs server-generated via `randomUUID()`; boundary data as `unknown` until validated).
5. **Don't redefine types that are part of the public HTTP contract.** Reference them: *"Returned to clients as part of `POST /tasks` — see [`api-contract.md`](api-contract.md)."*
6. Aggregate across days: if day-3 introduces `Task` and day-4 adds `subtask`, show both. Optional closing `## Changes` per type.
7. Cross-link every type to its definition file in `src/`.

## HITL checkpoints

- **STOP — WAIT** if the diff against an existing doc would change a type's shape (rename, field removal, status enum change).
- **HUMAN TRIGGER — reconciliation** if inconsistencies between days are found (e.g., day-3 said `id: number`, day-4 wrote `id: string`). Surface the conflict; don't pick silently.

## When to run

- After any cycle that adds or modifies a type.
- At end of day, alongside other `/doc-*` skills.
