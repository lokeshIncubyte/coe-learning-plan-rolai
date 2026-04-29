---
name: doc-user-stories
description: Generate user-stories.md — lettered scenarios covering happy and failure paths.
---

# doc-user-stories

## Inputs

- `<project>/docs/spec/requirements.md` (or per-day equivalent)
- `<project>/docs/spec/checklist.md`
- **Style template:** [`day-2/picsum-lab/docs/user-stories.md`](../../../day-2/picsum-lab/docs/user-stories.md) — read first

## Output

`<project>/docs/user-stories.md`

## Steps

1. Read the style template — match its style: lettered stories (A, B, C…), short numbered steps inside each, italicized failure-path note where it fits.
2. Read `requirements.md` and `checklist.md`. **Every Build, Validate, and Verify item in the checklist must be traceable to at least one story.** Add stories if anything is uncovered.
3. Story shape:

```markdown
## A — <one-line behavior>

1. <user/client action>
2. <system response or state change>
3. <next step>

*<Failure-path note: what happens if step N fails / errors / is invalid>*
```

4. Phrase steps for the project type:
   - **HTTP API**: requests and responses ("Client sends `POST /tasks` with valid body → server creates and returns the task with an id and default status").
   - **UI**: user interactions ("User activates a gallery row → selection state updates → preview updates").
5. Cover at minimum:
   - **Happy path** for every primary endpoint or user flow.
   - **Validation rejection** — what happens with invalid input.
   - **State-reflects-prior-write** — read after write returns the new state (catches stale-cache / not-persisted bugs).
   - **Edge cases the requirements explicitly call out** (e.g., "non-positive width should be rejected").
6. If requirements name user types or roles, prefix each story: `## A — (Admin) Delete a task`.
7. Aggregate across days: stories from day-3 stay; day-4 adds new ones. Optional closing `## Changes` listing what each day added.

## HITL checkpoints

- **STOP — WAIT** before overwriting an existing user-stories doc — the user may have hand-edited a story to capture a subtle product decision. Surface the diff.
- **HUMAN TRIGGER — coverage check** at the end: list every checklist Build/Validate/Verify item and confirm each is covered by at least one story. Flag gaps for user decision.

## When to run

- **Before Build** as design — drives `/tdd-plan` cycle scope.
- **After Build** as confirmation — each story's expected behavior should be a Verify checklist item.

Same doc serves both. Refine as code lands.
