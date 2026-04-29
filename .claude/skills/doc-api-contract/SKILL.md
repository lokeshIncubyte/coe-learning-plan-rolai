---
name: doc-api-contract
description: Generate api-contract.md — public HTTP endpoints with shapes and examples.
---

# doc-api-contract

**Skip this skill entirely** for projects that don't expose a public contract (libraries with internal-only types, scripts).

## Inputs

- `<project>/src/` — controllers, route handlers, command definitions
- `<project>/docs/schema-internal.md` — for typed shapes referenced from the contract
- **Style template:** [`day-2/picsum-lab/docs/schema-remote.md`](../../../day-2/picsum-lab/docs/schema-remote.md) — read first; that doc describes an *upstream* API the day-2 app consumed. **Flip the direction**: this project IS the API.

## Output

`<project>/docs/api-contract.md`

## Steps

1. Read the style template — match its table-driven style (per-endpoint table, example JSON, error shape). But flip direction: this project is the producer.
2. Read `<project>/src/` to discover real endpoints. **Don't list endpoints that don't exist.** If `tdd-plan.md` mentions a future endpoint, omit it (or put under a closing `## Planned` section if the user wants design-ahead docs).
3. Top of the doc: a **Global setup** section covering:
   - Base URL pattern (`http://localhost:<port>` for dev; deployment-specific for prod)
   - Default port (read from `main.ts` or equivalent)
   - `Content-Type: application/json` for all bodies (or framework's default)
   - Whether validation is global — and if so, that every endpoint inherits the same error envelope
4. One section per endpoint, each with:
   1. **Summary table**: method, path, success status, request body type (linked to `schema-internal.md`), response body type
   2. **Typed code block** referencing entity/DTO names from `schema-internal.md` — don't redefine, link
   3. **Real-shaped example** request and response JSON
   4. **Error path**: what statuses can be returned + the response body shape for each (typically framework's default validation envelope for 400)
5. Aggregate across days: if day-3 ships `GET /tasks` and day-4 adds `DELETE /tasks/:id`, show both. Optional closing `## Changes` per endpoint.
6. Cross-link to `schema-internal.md` for shapes; cross-link to `user-stories.md` for the scenarios that exercise each endpoint.

## HITL checkpoints

- **STOP — WAIT** if any existing endpoint's contract would change shape (status code change, field rename, breaking response shape).
- **HUMAN TRIGGER — example freshness** when refining: examples drift from reality fast. Ask the user to spot-check one example by `curl`-ing the actual endpoint.

## When to run

- After any cycle that adds or changes an endpoint.
- Run **after** `/doc-schema-internal` (this doc references its types).
