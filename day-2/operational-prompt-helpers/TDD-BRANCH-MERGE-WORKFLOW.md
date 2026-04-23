# TDD Workflow: Merge to `main` After Every Completed Cycle

This document defines the exact workflow for developing Picsum Lab with TDD while merging to `main` after each completed red-green-refactor cycle.

---

## Core rule

- **Red commits are allowed only on a feature branch.**
- **`main` must always stay green.**
- A cycle is considered complete only when all tests pass after refactor.
- **Merge to `main` after each completed cycle** (small, frequent integrations).

---

## Per-cycle workflow (repeat for every behavior)

## 1) Start a short-lived branch from latest `main`

1. Checkout `main`.
2. Pull latest `main`.
3. Create a branch for one behavior only.

Recommended branch name pattern:

- `tdd/<feature>-<behavior>`
- Example: `tdd/gallery-fetch-loading-state`

---

## 2) RED: write failing test first

1. Add/modify a test that captures one behavior.
2. Run tests.
3. Confirm this new test fails for the expected reason.
4. Commit the failing test on the branch.

Commit message format:

- `red: <behavior>`
- Example: `red: show loading state while gallery request is in flight`

Checklist before moving on:

- Test failure is real (not typo/config issue).
- Failure message matches intended behavior gap.

---

## 3) GREEN: implement minimum code to pass

1. Write the smallest implementation that makes the red test pass.
2. Run targeted tests, then full test suite.
3. Commit once green.

Commit message format:

- `green: <behavior>`
- Example: `green: set gallery status to loading before fetch resolves`

Checklist:

- New test passes.
- Existing tests still pass.
- No extra refactor mixed in.

---

## 4) REFACTOR: clean code while staying green

1. Refactor naming, duplication, file structure, or small abstractions.
2. Keep behavior unchanged.
3. Run full test suite again.
4. Commit refactor.

Commit message format:

- `refactor: <what was improved>`
- Example: `refactor: extract gallery status mapping helper`

Checklist:

- All tests pass.
- Diff contains cleanup only.

---

## 5) Pre-merge gate for this cycle

Before merging this cycle branch into `main`, verify:

1. Full test suite is green.
2. Lint/typecheck/build are green (if configured).
3. Branch contains exactly this cycle’s scope.
4. No debug logs or temporary hacks.

If anything fails, fix on branch and recommit before merge.

---

## 6) Squash and merge to `main`

After the cycle is fully green:

1. Open PR from cycle branch into `main`.
2. Use **Squash and merge**.
3. Squash commit message should describe the completed behavior outcome.

Squash commit message format:

- `feat: <completed behavior>`
- Example: `feat: display gallery loading state during photo list fetch`

Then:

4. Delete merged branch.
5. Pull latest `main`.
6. Start next cycle from updated `main`.

---

## Commit discipline summary

On feature branch (during cycle):

- `red: ...`
- `green: ...`
- `refactor: ...`

On `main` (after squash merge):

- One clean commit per completed behavior:
  - `feat: ...` (or `fix: ...` when correcting behavior)

This keeps TDD evidence in branch history and keeps `main` clean and always green.

---

## Manual verification checklist per cycle

Run this before merge:

- [ ] New behavior works in UI manually.
- [ ] Related failure path is handled (if relevant).
- [ ] Unit/integration tests pass.
- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] PR scope is one behavior only.

---

## Suggested cycle plan for Picsum Lab

Use one branch/merge per item:

1. Gallery fetch loading state.
2. Gallery fetch success rendering.
3. Gallery fetch error state.
4. API payload guard rejection path.
5. Row selection state.
6. Preview URL builder (`id` source).
7. Width/height controls.
8. Grayscale/blur query params.
9. Random nonce cache-bust.
10. Optional localStorage restore.

Each item follows the same red -> green -> refactor -> squash merge pattern.

