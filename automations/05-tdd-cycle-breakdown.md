# 05 — TDD Cycle Breakdown

Take the *Build* phase items from `checklist.md` and break them into the smallest possible Red → Green → Refactor cycles. Then review the plan and prune any tests that would pass without code being written.

---

## When to run

After Phase 3 (Setup) — the project is scaffolded, the dev server boots — and **before** Phase 5 (Build) starts. The plan this automation produces drives the entire Build phase.

## Inputs

- A confirmed `<project>/docs/spec/checklist.md` with a populated *Build* (and ideally *Validate*, *Verify*) phase
- Existing project source at `<project>/src/` so the agent knows what's already there

## Outputs

- `<project>/docs/spec/tdd-plan.md` — the cycle-by-cycle plan
- (After review) — a refined `tdd-plan.md` with weak tests removed or strengthened, plus a short **Adjustments log** at the bottom recording what changed and why

---

## Step 1 — Generate the plan

### Prompt

> Read `<project>/docs/spec/checklist.md` and the existing source at `<project>/src/`. Produce `<project>/docs/spec/tdd-plan.md` that breaks the *Build* (and *Validate*, *Verify*) phase items into the smallest possible Red → Green → Refactor cycles.
>
> **The plan structure** — `tdd-plan.md` should have:
>
> 1. A short **header** noting the source checklist and the date.
> 2. **Setup steps** — items that aren't testable as behavior (CLI generators, dependency installs, type-only definitions). One bullet per item; no RED/GREEN structure. These will be done on the *first* feature branch as part of GREEN.
> 3. **Cycles** — one section per behavior cycle, in execution order. Each cycle has the structure below.
> 4. A **Mapping table** at the end: every checklist Build/Validate/Verify item → which cycle covers it. Anything unmapped is a gap; flag it.
>
> **Per-cycle structure** — exactly:
>
> ```markdown
> ### Cycle N — <one-line behavior under test>
>
> - **Branch**: `tdd/<kebab-slug>`
> - **Behavior**: <2–3 sentences describing the user-observable behavior, not the implementation>
> - **RED**:
>   - **Test file**: `<path/to/file>.spec.ts` (or `.test.ts`)
>   - **Assertion**: <one or two concrete asserts the test will make>
>   - **Why it fails today**: <what's missing in `src/` that makes this test red>
> - **GREEN**:
>   - **Smallest change**: <the minimum implementation that turns the test green>
>   - **Files touched**: <list of files that will be created or edited>
> - **REFACTOR**:
>   - <Specific opportunities — extract, dedupe, rename. "None yet" is a valid answer; don't invent refactors.>
>
> **Maps to checklist items**: <bullet list quoting the checklist text>
> ```
>
> **Granularity rules**:
> - Each cycle covers **one** observable behavior. If a cycle's RED would have multiple unrelated assertions, split it.
> - Infrastructure (modules, controllers, DTOs, type definitions) is **not** a cycle on its own — it emerges inside a cycle's GREEN as the minimum to pass that cycle's RED.
> - Validation behaviors are *separate* cycles from happy-path behaviors. "POST /tasks creates a task" and "POST /tasks rejects empty title" are two cycles.
> - Order cycles so each one builds on the previous. Read–before–write where possible (an empty `GET /tasks` returning `[]` typically comes before `POST /tasks` creating one).
>
> When done, summarize at the top of the file: number of setup steps, number of cycles, and which cycles are validation vs. happy-path. **Do not** start writing tests or code yet — Phase 5 (Build) does that.

---

## Step 2 — Review: prune tests that pass without code

After Step 1 produces the plan, run this review **before** starting Phase 5. The goal: catch RED tests that are silently green from the start, which would render the cycle pointless.

**This step is a HUMAN TRIGGER.** The agent does the analysis and proposes adjustments, but the final pruned plan needs your sign-off before any branch is cut in Phase 5. Read the *Adjustments log* the agent appends; reply *approve* or call out cycles you think were misjudged.

### Prompt

> Review `<project>/docs/spec/tdd-plan.md` cycle by cycle. For each cycle, answer this question honestly: **"If I write this RED test right now against the current `src/` and run it, does it actually fail?"**
>
> Read the current `src/` to verify. Categorize each cycle:
>
> | Verdict | Meaning | Action |
> |---|---|---|
> | ✅ Genuinely red | The test will fail because the behavior isn't implemented | Keep as-is |
> | ⚠️ Trivially green | The test would pass without any new code (e.g., the scaffold's default route already returns the asserted shape; a CLI-generated class already exists; a type-only assertion always compiles) | **Remove** the cycle, **or** strengthen the assertion to test actual behavior |
> | 🟡 Partially red | Some assertions in the test would pass, others would fail | **Tighten** — focus the test on only the failing behavior; keep RED honest |
>
> Common "trivially green" patterns to look for:
> - Asserting a class / module / decorator *exists* — the framework's CLI generates it; existence isn't behavior.
> - Asserting the dev server returns 200 on the scaffold's default route — Nest, Vite, etc. do that out of the box.
> - Asserting a TypeScript type compiles — that's a compiler check, not a runtime test.
> - Asserting a service is `defined` after `Test.createTestingModule(...)` — that's just DI working, not your behavior.
> - Asserting an empty list is returned when the in-memory store starts empty — true even if `findAll()` is unimplemented and returns `undefined`, depending on the assertion. *Tighten*: assert `Array.isArray(result) && result.length === 0`, not just `result.toEqual([])`.
>
> Update `tdd-plan.md`:
> 1. **Remove** ⚠️-trivially-green cycles outright if they don't represent a real behavior.
> 2. **Strengthen** ⚠️-trivially-green cycles that *do* represent a real behavior — rewrite the assertion so it actually probes the behavior.
> 3. **Tighten** 🟡-partial cycles to focus only on the unimplemented behavior.
> 4. Append an **`## Adjustments log`** section at the bottom of `tdd-plan.md` listing every change made in this review and the reason. Format:
>    ```markdown
>    ## Adjustments log
>
>    - **Removed Cycle 3** (controller existence) — CLI-generated; no behavior to drive.
>    - **Strengthened Cycle 5** (validation) — original assertion only checked status code; now also asserts the error response shape.
>    - **Split Cycle 7** — happy-path and error-path were bundled; now Cycles 7 and 7b.
>    ```
>
> Stop when every remaining cycle is ✅ Genuinely red. The Build phase only runs cycles from this pruned list.

---

## Plan structure (template the agent should follow)

```markdown
# TDD Plan — <project-name>

**Source**: `docs/spec/checklist.md`
**Generated**: <date>
**Cycles**: <N> (<H> happy-path · <V> validation · <E> error-path)
**Setup steps**: <M>

---

## Setup steps

- Install `<dep>` (covers checklist item: "Install class-validator and class-transformer")
- …

---

## Cycles

### Cycle 1 — GET /tasks returns an empty list initially

- **Branch**: `tdd/list-tasks-empty`
- **Behavior**: A fresh server with no prior writes responds to `GET /tasks` with HTTP 200 and an empty array.
- **RED**:
  - **Test file**: `src/tasks/tasks.controller.spec.ts`
  - **Assertion**: `expect(response.status).toBe(200); expect(response.body).toEqual([]);`
  - **Why it fails today**: `TasksController` and `TasksService` don't exist yet.
- **GREEN**:
  - **Smallest change**: Generate `tasks.module`, `tasks.controller`, `tasks.service`. `TasksService.findAll()` returns the empty in-memory array; `@Get()` returns `service.findAll()`.
  - **Files touched**: `src/tasks/tasks.module.ts`, `src/tasks/tasks.controller.ts`, `src/tasks/tasks.service.ts`, `src/app.module.ts` (import `TasksModule`)
- **REFACTOR**: None yet.

**Maps to checklist items**:
- Generate the tasks module
- Generate the controller
- Generate the service
- Implement TasksService with in-memory business logic (`getAll`)
- Wire TasksService into TasksController via constructor injection
- GET /tasks — return all tasks
- (Verify) GET /tasks returns `[]` initially

### Cycle 2 — POST /tasks creates a task

…

---

## Mapping table

| Checklist item | Covered by |
|---|---|
| GET /tasks — return all tasks | Cycle 1 |
| POST /tasks — create a new task from request body | Cycle 2 |
| Validation: invalid POST returns 400 | Cycle 4 |
| … | … |

## Adjustments log

*(filled in after Step 2 review)*
```

---

## Verification

After both steps:
1. Open `tdd-plan.md` — every cycle has a ✅ in the *Adjustments log* (either kept or strengthened, no ⚠️ left).
2. The mapping table covers every Build / Validate / Verify item from `checklist.md`. If anything is uncovered, add a cycle for it.
3. Walk one cycle mentally through Phase 5 (Build): is the branch name unique? Is the assertion narrow enough? Is the GREEN small enough that REFACTOR is worth a separate commit?

## Cross-links

- Methodology context: [`process/05-build.md`](process/05-build.md) — the Build phase that consumes this plan
- Previous: [`04-scaffold-project.md`](04-scaffold-project.md)
- Next: Phase 5 (Build) — see [`process/05-build.md`](process/05-build.md) for the per-cycle execution protocol (branch → RED → GREEN → REFACTOR → squash-merge)
