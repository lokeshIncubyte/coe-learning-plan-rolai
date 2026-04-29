---
name: tdd-plan
description: Break Build items into smallest RGR cycles; prune trivially-green tests.
---

# tdd-plan

## Inputs

- `<project>/docs/spec/checklist.md` (Build / Validate / Verify phases)
- `<project>/src/` — to know what already exists

## Output

`<project>/docs/spec/tdd-plan.md` with cycles in execution order, a mapping table, and an *Adjustments log* showing what the review pruned.

## Step 1 — Generate the plan

Produce `tdd-plan.md` with these sections:

1. **Header** — source checklist, date, cycle count.
2. **Setup steps** — non-testable items (CLI generators, deps to install, type definitions). One bullet each; no RED/GREEN structure. These get absorbed into the first relevant GREEN.
3. **Cycles** — one section per behavior, in execution order. Each cycle uses this exact template:

```markdown
### Cycle N — <one-line behavior>

- **Branch**: `tdd/<kebab-slug>`
- **Behavior**: <2–3 sentences describing user-observable behavior, not implementation>
- **RED**:
  - **Test file**: `<path>.spec.ts` (or `.test.ts`)
  - **Assertion**: <one or two concrete asserts the test will make>
  - **Why it fails today**: <what's missing in `src/` that makes this test red>
- **GREEN**:
  - **Smallest change**: <minimum implementation to turn RED green>
  - **Files touched**: <list>
- **REFACTOR**: <specific opportunities, or "None yet">

**Maps to checklist items**: <bullets quoting the checklist text>
```

4. **Mapping table** at the end: every checklist Build/Validate/Verify item → which cycle covers it. Anything unmapped is a gap; flag it.

### Granularity rules

- Each cycle covers **one** observable behavior. Split if RED would have multiple unrelated assertions.
- Infrastructure (modules, controllers, DTOs, type definitions) is **not** a cycle on its own — it emerges inside a cycle's GREEN as needed.
- Validation cycles are *separate* from happy-path cycles ("POST /tasks creates" and "POST /tasks rejects empty title" are two cycles).
- Order cycles so each builds on the previous (read before write where possible).

## Step 2 — Review for trivially-green tests — HUMAN TRIGGER

For each cycle, answer honestly: *"If I write this RED test now against current `src/`, does it actually fail?"* Verify by reading `src/`.

Categorize:
- ✅ **Genuinely red** → keep
- ⚠️ **Trivially green** → **remove or strengthen** (test would pass without new code)
- 🟡 **Partially red** → **tighten** to focus on only the failing behavior

### Common "trivially green" patterns

- Asserting a class / module / decorator *exists* (CLI generates it)
- Asserting the dev server returns 200 on the scaffold's default route
- Asserting a TypeScript type compiles (compiler check, not runtime)
- Asserting a service is `defined` after `Test.createTestingModule(...)` (just DI working)
- Lax `toEqual([])` against an unimplemented method (may pass if method returns `undefined` depending on matcher) — tighten to `expect(Array.isArray(result) && result.length === 0)`

### Update the plan

- Remove or strengthen ⚠️ cycles.
- Tighten 🟡 cycles.
- Append an `## Adjustments log` at the bottom listing every change with its reason.

### Approval

Surface the *Adjustments log* and ask the user to **approve the pruned plan** before any branch is cut. Reply: *approve* or call out cycles you think were misjudged.
