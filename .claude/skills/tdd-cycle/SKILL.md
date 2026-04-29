---
name: tdd-cycle
description: Execute one Red→Green→Refactor cycle from tdd-plan.md — branch, RED, GREEN, REFACTOR, squash-merge. Run once per cycle.
---

# tdd-cycle

## Inputs

- `<project>/docs/spec/tdd-plan.md` — pick the first cycle not yet merged to `main`
- `<project>/docs/spec/checklist.md` — to tick items at the end

## Output

One commit on `main` (see format below), branch deleted locally, one or more checklist items ticked.

### Squash commit message format

```
feat(cycle-N): <one-line behavior>

RED: <test file> — <what the assertion checked>
GREEN: <files created/modified> — <minimum change that made RED pass>
REFACTOR: <what was improved, or "none">
```

The subject line is `feat(cycle-N)` so commit history reads as an ordered log of behaviors. The body preserves the RED/GREEN/REFACTOR narrative that the squash erased from branch history.

## Rules

- **Test-first.** No production code without a failing test demanding it.
- **One behavior per cycle.** Validation and happy-path are separate cycles.
- **One commit per RED / GREEN / REFACTOR step** on the feature branch. `main` gets one commit per cycle (via squash).
- **`main` always stays green** between invocations.
- **No "yet" code.** GREEN is the *smallest* change that makes RED pass. New behavior = new cycle.

## The 15 sub-steps

### 05b.1 — Pick next cycle (NO STOP)

Read `tdd-plan.md`. Find the first cycle not yet merged to `main`. Announce the cycle number, branch name, and behavior.

### 05b.2 — Branch from `main` (STOP — WAIT first time)

```bash
git checkout main
git pull
git checkout -b tdd/<cycle-slug>
```

### 05b.3 — Write the failing test (NO STOP)

Write the test exactly as specified in the cycle's RED section. No production code in this commit.

### 05b.4 — RED proof (NO STOP)

```bash
<package-manager> test -- <path/to/new.spec.ts>
```

Expected: the new test fails. **If it passes unexpectedly** → cycle is trivially green; stop and tell the user to re-run `/tdd-plan` Step 2 for that cycle.

### 05b.5 — RED commit (STOP — WAIT if surprise files staged)

```bash
git add <test-file>
git commit -m "red: <one-line behavior>"
```

Only the test file should be staged.

### 05b.6 — GREEN — smallest production code (NO STOP)

Implement only what the cycle's GREEN section specifies. Resist scope creep. Run framework CLI generators where they apply (`<framework-cli> g <thing> <name>`) — these count as part of GREEN.

### 05b.7 — GREEN proof (NO STOP)

```bash
<package-manager> test -- <path/to/new.spec.ts>
<package-manager> test                         # also full suite
```

Expected: new test passes; full suite still green. **If a previously passing test now fails** → revert and try a smaller change. **If the new test still fails** → diagnose root cause (capture symptom, inspect right layer, smallest fix); do not "fix forward."

### 05b.8 — Review GREEN diff — HUMAN TRIGGER

Surface `git diff` of unstaged changes + a one-line summary of what was added and why. The user reads asking:
- Is this the **smallest** change? Anything removable without breaking the test?
- Is there scope creep — code without a test driving it?
- Naming / layering / patterns OK for later cycles?

If adjustment needed, make the smallest correction and re-run 05b.7. If GREEN is good, proceed to 05b.9. **Most valuable HITL point in the cycle.**

### 05b.9 — GREEN commit (STOP — WAIT)

```bash
git add <touched-files>
git status   # verify only intended files staged
git commit -m "green: <one-line behavior>"
```

### 05b.10 — REFACTOR — planned changes only (NO STOP)

Apply only the cycle's planned refactors. **Skip 05b.10–05b.13 entirely if the plan said "None yet"** and jump to 05b.14. Do **not** add new behavior in REFACTOR.

### 05b.11 — REFACTOR proof (NO STOP)

```bash
<package-manager> test
```

Expected: every test passes. **If anything turned red** → refactor changed behavior; revert and split as a properly-driven new cycle.

### 05b.12 — Review REFACTOR diff — HUMAN TRIGGER

Surface the refactor diff + one-line summary. The user reads asking:
- Did it improve readability / remove duplication / clarify intent?
- Did behavior sneak in (renamed method also got an extra branch; extracted helper has a new code path)?

If adjustment needed, correct, re-run 05b.11. If good, proceed.

### 05b.13 — REFACTOR commit (STOP — WAIT)

```bash
git add <touched-files>
git commit -m "refactor: <what changed>"
```

### 05b.14 — Squash-merge to `main` (STOP — WAIT)

```bash
git checkout main
git pull
git merge --squash tdd/<cycle-slug>
git commit -m "$(cat <<'EOF'
feat(cycle-N): <one-line behavior>

RED: <test file> — <what the assertion checked>
GREEN: <files created/modified> — <minimum change that made RED pass>
REFACTOR: <what was improved, or "none">
EOF
)"
git branch -D tdd/<cycle-slug>           # local cleanup
```

The branch's RED/GREEN/REFACTOR commits become *one* `feat(cycle-N): …` commit on `main`. The body preserves the RED/GREEN/REFACTOR narrative that the squash erased. Use the cycle number from `tdd-plan.md` (e.g. `feat(cycle-3): …`).

### 05b.15 — Tick the checklist (NO STOP)

Update `- [ ]` → `- [x]` in `checklist.md` for every Build/Validate/Verify item this cycle's mapping table covers.

## Branching cheat-sheet

| Action | Command |
|---|---|
| Branch | `git checkout -b tdd/<slug>` (off latest `main`) |
| RED commit | `git commit -m "red: <behavior>"` |
| GREEN commit | `git commit -m "green: <behavior>"` |
| REFACTOR commit | `git commit -m "refactor: <change>"` |
| Squash-merge | `git checkout main && git merge --squash <branch> && git commit` (use HEREDOC with RED/GREEN/REFACTOR body — see 05b.14) |
| Branch cleanup | `git branch -D <branch>` |
