---
name: ship-day
description: Reorganize files, write verified .gitignore, stage by name, commit, push.
---

# ship-day

## Output

- Reorganized `<project>/docs/`
- `<project>/.gitignore` with verified rules
- One commit on `<branch>`, pushed to remote

## Rules

- Reorganize **before** committing, not after — code review against a clean tree is faster.
- Every file move includes fixing every relative link it breaks.
- Network-visible operations (commit, push, PR) **always** stop for explicit approval.

## Step 1 — Organize files (STOP — WAIT before destructive moves)

Project should hold its own `README.md`, `docs/`, `.gitignore`. Anyone receiving just that folder should be able to run it.

Recommended `docs/` layout:

```
<project>/docs/
├── spec/         ← what to build (requirements, checklist)
├── notes/        ← concepts learned (per-topic)
└── references/   ← external materials
```

For multi-day projects, per-day work moves under `docs/days/<day-N>/`; project-wide compilations live one level up.

After any move, fix relative links. `replace_all` handles most fixes one-shot.

## Step 2 — Add `.gitignore`

### 2.1 Pick the rule set

Standard ignores for the language/framework (`node_modules/`, `dist/`, `target/`, `.venv/`, etc.) plus common project-specific rules:

Markdown — exclude stray, keep README + docs:
```
*.md
!README.md
!docs/**
!**/docs/**
```

Environment — exclude .env, keep template:
```
.env
.env.*
!.env.example
```

**STOP — WAIT** if any rule is unusual (excludes README, excludes a tracked file).

### 2.2 Verify rules with `git check-ignore -v`

Probe real and hypothetical files. A matching rule starting with `!` means *not ignored*:

```bash
git check-ignore -v docs/spec/checklist.md     # should match !**/docs/** (not ignored)
git check-ignore -v README.md                  # should match !README.md (not ignored)
git check-ignore -v scratch.md                 # should match *.md (ignored)
```

Verify each expectation explicitly — don't trust the pattern.

## Step 3 — Commit (STOP — WAIT)

```bash
git add <files>            # named files, NEVER `git add .`
git status                 # confirm only intended files staged
git commit                 # see message format below
```

`git add .` accidentally stages secrets, build output left over from a failed `.gitignore`, and editor backups. Stage explicitly.

**Commit message format** — use a subject + body when the commit aggregates multiple phases:

```
feat(<scope>): <one-line summary of what was shipped>

- <phase or item 1>: <what it delivered>
- <phase or item 2>: <what it delivered>
- <any env quirks fixed or notable decisions>
```

Keep the subject under 72 characters. The body is where reviewers and future-you understand what each phase contributed without digging through individual cycle commits.

**STOP — WAIT** if `git status` shows surprise files. Commit is irreversible without history rewrite.

## Step 4 — Push (STOP — WAIT)

```bash
git push -u origin <branch>
```

Network-visible. Even if the commit was approved, push is a separate decision.
