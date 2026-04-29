# Phase 5 — Build (TDD)

[← Back to index](README.md) · Previous: [Phase 4 — Diagnose](04-diagnose.md) · Next: [Phase 6 — Verify](06-verify.md)

---

## Rules

- **Test-first.** No production code is written before a failing test demands it.
- **One behavior per cycle.** Each cycle is *one* RED → GREEN → REFACTOR sequence covering one observable behavior. Validation and happy-path are separate cycles.
- **One commit per RED / GREEN / REFACTOR step** on the feature branch. The branch carries the RGR history; `main` carries one commit per *cycle* (via squash merge).
- **One feature branch per cycle.** Branch from `main`, do the cycle, squash-merge back. Don't pile multiple cycles into one branch.
- **`main` is always green.** Nothing lands on `main` until its cycle's tests pass and the project still boots.
- **No "yet" code.** GREEN is the *smallest* change that makes RED pass. Resist scope creep — extra logic without a test driving it goes in a future cycle.

---

## Step 05a — Get a TDD plan

A plan is required before any branching. Without it, "smallest possible" is a feeling rather than a list.

### 05a.1 Generate or load the plan

If `<project>/docs/spec/tdd-plan.md` already exists from [`../05-tdd-cycle-breakdown.md`](../05-tdd-cycle-breakdown.md) Step 1, read it.

If it doesn't exist, run that automation now — both Steps 1 and 2.

**NO STOP** — Agent reads or generates.

### 05a.2 Review the plan for tests-that-pass-without-code

Run [`../05-tdd-cycle-breakdown.md`](../05-tdd-cycle-breakdown.md) Step 2 if it hasn't been run already. Confirm the *Adjustments log* exists and every remaining cycle is genuinely red (would fail today against the current `src/`).

If a cycle is trivially green and can't be strengthened into a real behavior test, **delete it**. A cycle that always passes is dead weight.

**STOP — WAIT** — User confirms the pruned plan before any cycle starts.

---

## Step 05b — Execute one cycle

Loop this entire step once per cycle in `tdd-plan.md`, in order. Each cycle is self-contained.

### 05b.1 Pick the next cycle

Read `tdd-plan.md`. Find the next cycle that is still on `main` (not yet shipped). Announce the cycle number, branch name, and behavior.

**NO STOP** — Trivial.

### 05b.2 Branch from `main`

```bash
git checkout main
git pull
git checkout -b tdd/<cycle-slug>
```

**STOP — WAIT** the first time on a new machine; subsequent branches once the workflow is approved.

### 05b.3 RED — write the failing test

Write the test exactly as specified in the cycle's *RED* section. Use the framework's idioms (`describe`/`it` blocks, `Test.createTestingModule(...)` for Nest unit tests, `supertest` for HTTP integration, etc.). No production code in this commit.

**NO STOP** — Agent-owned.

### 05b.4 RED proof — run the test, see it fail

```bash
<package-manager> test -- <path/to/new.spec.ts>
```

**Expected**: the new test fails. Any other test that was already passing must still pass — the new test should not be a syntax error or import failure that brings down the whole suite.

If the new test *passes* unexpectedly, return to [Step 05a.2](#05a2-review-the-plan-for-tests-that-pass-without-code) and re-review the plan — the cycle is trivially green.

**NO STOP** — Read-only.

### 05b.5 RED commit

```bash
git add <test-file>
git commit -m "red: <one-line behavior from the cycle>"
```

Examples: `red: GET /tasks returns empty list`, `red: POST /tasks rejects empty title`.

**STOP — WAIT** if anything other than the test file is staged. The RED commit must contain *only* the failing test.

### 05b.6 GREEN — write the smallest production code

Implement only what the cycle's *GREEN* section specifies. Resist:
- Adding unrequested fields to the response.
- Adding error handling beyond what the framework provides for free.
- Adding "while I'm here" cleanups.

If the cycle calls for CLI scaffolding, run it now (it's part of the GREEN — modules and controllers are infrastructure, not behavior):

```bash
<framework-cli> g <thing> <name>
```

**NO STOP** — Agent-owned.

### 05b.7 GREEN proof — re-run the test, see it pass

```bash
<package-manager> test -- <path/to/new.spec.ts>
<package-manager> test                                # also run the full suite
```

**Expected**: the new test passes; the full suite is still green. If a previously passing test now fails, GREEN went too far — revert and try a smaller change.

**NO STOP** — Read-only.

### 05b.8 Human review of GREEN code

The agent surfaces the diff (`git diff` of unstaged changes) plus a short summary of *what was added and why*. The user reads the GREEN code with these questions in mind:

- Is this the **smallest** change that makes the test pass? Anything that could be removed without breaking the test?
- Does it introduce naming, layering, or pattern choices that will be awkward in later cycles?
- Is there scope creep — code without a test driving it?

If something needs adjustment, the user says so; the agent makes the smallest correction and re-runs 05b.7 (GREEN proof) before continuing. If GREEN is good, the user says *proceed* and the agent moves to 05b.9.

**HUMAN TRIGGER — review the GREEN diff before it commits.** This is the most valuable review point in the cycle — once the diff is committed and squashed onto `main`, refactoring it costs more.

### 05b.9 GREEN commit

```bash
git add <touched-files>
git status   # verify only the intended files are staged
git commit -m "green: <one-line behavior>"
```

**STOP — WAIT** if `git status` shows unexpected files (forgotten test fixtures, accidental config changes).

### 05b.10 REFACTOR — improve, with the safety net of green tests

Apply the cycle's planned refactors *only*. If the plan said "None yet", skip steps 05b.10 through 05b.13 and jump straight to Step 05b.14 (squash-merge). Common refactors:
- Extract a duplicated literal into a constant.
- Move a private helper from controller to service (or vice versa).
- Rename a variable that confused you while writing GREEN.

**Do not** add new behavior in REFACTOR. New behavior = new cycle.

**NO STOP** — Agent-owned.

### 05b.11 REFACTOR proof — full suite still green

```bash
<package-manager> test
```

**Expected**: every test passes. If anything turned red, the refactor changed behavior — revert and split the change into a properly-driven cycle.

**NO STOP** — Read-only.

### 05b.12 Human review of REFACTOR

The agent surfaces the refactor diff and a one-line summary of *what changed shape, and why*. The user reads with these questions:

- Did the refactor actually improve readability / remove duplication / clarify intent? If unclear, the refactor isn't worth the commit.
- Did any behavior sneak in (renamed method also got an extra branch; extracted helper has a new code path)? If yes, revert the sneak-in — that's a separate cycle.
- Is the new shape the one we want for the next cycle to build on?

If the refactor needs adjustment, the user says so; the agent corrects, re-runs 05b.11 (proof), and re-asks. If the refactor is good, *proceed* moves to 05b.13.

**HUMAN TRIGGER — review the REFACTOR diff before it commits.** Skip this trigger entirely if step 05b.10 was "None yet" — there's nothing to review.

### 05b.13 REFACTOR commit

```bash
git add <touched-files>
git commit -m "refactor: <what changed>"
```

**STOP — WAIT** if anything unexpected is staged.

### 05b.14 Squash-merge to `main`

```bash
git checkout main
git pull
git merge --squash tdd/<cycle-slug>
git commit -m "feat: <cycle behavior>"   # one clean commit on main per cycle
git branch -D tdd/<cycle-slug>           # local cleanup; safe because squashed history is on main now
```

The branch's RED/GREEN/REFACTOR commits become *one* `feat: …` commit on `main`. The detailed history is preserved by the branch's reflog (and by your local backup if you push the branch before deletion).

**STOP — WAIT** — `git merge --squash` is a structural change to `main`. Confirm the staged diff before committing.

### 05b.15 Tick the checklist item(s)

Update `- [ ]` → `- [x]` in `<project>/docs/spec/checklist.md` for every Build/Validate/Verify item that this cycle's mapping table covers. Note the cycle number alongside if helpful.

**NO STOP** — Agent-owned.

---

## Step 05c — Loop or exit

Return to [Step 05b](#step-05b--execute-one-cycle) for the next cycle. When `tdd-plan.md` has no remaining cycles, Phase 5 is done — proceed to [Phase 6 — Verify](06-verify.md).

---

## When verification fails inside a cycle

If 05b.4 (RED proof) fails to fail, or 05b.7 (GREEN proof) fails to pass, branch to [Phase 4 — Diagnose](04-diagnose.md) for that one cycle. Do **not** "fix forward" by adding more code — diagnose root cause first. After diagnosis, the fix may be:
- The test was wrong — rewrite it, redo RED proof, re-commit.
- The plan was wrong — update `tdd-plan.md`, re-derive the cycle, restart on a fresh branch.
- An environment quirk — fix the env, save a memory file, re-run the proof.

---

## Branching cheat-sheet

| Action | Command |
|---|---|
| Branch for a cycle | `git checkout -b tdd/<cycle-slug>` (off latest `main`) |
| RED commit | `git commit -m "red: <behavior>"` |
| GREEN commit | `git commit -m "green: <behavior>"` |
| REFACTOR commit | `git commit -m "refactor: <change>"` |
| Squash-merge | `git checkout main && git merge --squash <branch> && git commit -m "feat: <behavior>"` |
| Branch cleanup | `git branch -D <branch>` (after squash) |

---

## Why this protocol

- **Branch per cycle** keeps `main`'s history clean (one commit per behavior) while preserving RED/GREEN/REFACTOR atomicity on the branch.
- **Squash merge** means a future reader of `git log main` sees the *behaviors that were added*, not the dance to add them.
- **One commit per RGR step on the branch** means a `git bisect` against the branch can pin exactly which step introduced a regression.
- **`main` always green** means any branch can be cut at any time without inheriting broken state.

Next: [Phase 6 — Verify](06-verify.md)
