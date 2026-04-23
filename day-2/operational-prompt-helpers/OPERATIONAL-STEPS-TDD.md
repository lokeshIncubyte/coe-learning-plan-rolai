# Picsum Lab Operational Steps (TDD Branch Workflow)

This is an execution runbook for delivering the project using short TDD cycles and merging to `main` after each completed cycle.

No implementation details are included here; this document is process-only.

---

## 1) Operating rules

1. Work on one behavior at a time.
2. Use a short-lived branch for each behavior.
3. Follow red -> green -> refactor in that branch.
4. Merge to `main` only after the cycle is fully green.
5. Keep `main` always passing.

---

## 2) Setup before first cycle

1. Ensure local `main` is up to date.
2. Confirm tests can run locally.
3. Prepare a simple tracking checklist for cycle status:
   - Branch created
   - Red committed
   - Green committed
   - Refactor committed
   - Pre-merge checks passed
   - Merged to `main`

---

## 3) Standard cycle procedure (repeat each feature)

### Step A: Create cycle branch

1. Checkout latest `main`.
2. Create one behavior-focused branch.
3. Branch naming pattern:
   - `tdd/<feature>-<behavior>`

### Step B: Red phase

1. Write or update tests for one behavior.
2. Run tests and confirm expected failure.
3. Commit with:
   - `red: <behavior>`

### Step C: Green phase

1. Make the minimum change to satisfy that behavior.
2. Re-run tests.
3. Commit with:
   - `green: <behavior>`

### Step D: Refactor phase

1. Improve structure/readability without changing behavior.
2. Re-run full tests.
3. Commit with:
   - `refactor: <what improved>`

### Step E: Pre-merge gate

1. Full test suite passes.
2. Build/typecheck/lint pass (if present).
3. Scope remains one behavior only.
4. Manual behavior check passes.

### Step F: Merge cycle

1. Open PR to `main`.
2. Squash and merge.
3. Squash message:
   - `feat: <completed behavior>`
   - Use `fix:` if it is a behavior correction.
4. Delete the cycle branch.
5. Pull latest `main`.
6. Start next cycle.

---

## 4) Project cycle sequence

Run these as separate cycles (one branch per item):

1. App shell boots.
2. Gallery fetch state handling.
3. API payload validation behavior.
4. Gallery rows and selection behavior.
5. Preview updates from selected image.
6. Size control behavior.
7. Effects control behavior.
8. Random refresh behavior.
9. Optional source mode behavior.
10. Optional preference persistence behavior.
11. Final integration verification cycle.

---

## 5) Manual verification checklist per cycle

Complete before each merge:

- [ ] New behavior is visible and works in UI.
- [ ] Relevant failure path is handled.
- [ ] Existing behavior is not regressed.
- [ ] Tests pass.
- [ ] Build/typecheck/lint pass (if configured).

---

## 6) End-of-project operational closeout

After final cycle merge:

1. Pull latest `main`.
2. Run full manual walkthrough:
   - First open
   - Gallery load
   - Selection
   - Controls update
   - Error handling
   - Optional persistence restore
3. Confirm no open feature branches remain.
4. Tag or note completion in your tracker.

---

## 7) Commit message quick reference

On feature branches:

- `red: <behavior>`
- `green: <behavior>`
- `refactor: <what improved>`

On `main` via squash merge:

- `feat: <completed behavior>`
- `fix: <completed behavior correction>`

