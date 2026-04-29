# Phase 7 — Ship

[← Back to index](README.md) · Previous: [Phase 6 — Verify](06-verify.md)

---

## Rules

- Reorganize *before* shipping, not after — code review against a clean tree is much faster.
- Every file move includes fixing every relative link it breaks.
- Network-visible operations (commit, push, PR) **always** stop for explicit approval.

---

## Step 07 — Organize files

### 07.1 Make the project self-contained

The project folder should hold its own `README.md`, `docs/`, and `.gitignore`. Anyone receiving just that folder should be able to run it.

A clean `docs/` layout (recommended):

```
<project>/docs/
├── spec/         ← what to build (requirements, checklist)
├── notes/        ← concepts learned (per-topic)
└── references/   ← external materials (PDFs, links, design docs)
```

For multi-day projects, see [`../multi-day-docs-structure.md`](../multi-day-docs-structure.md) — per-day work moves into `docs/days/<day-N>/`.

**STOP — WAIT** for user confirmation before destructive moves (`mv`, `rm`).

### 07.2 Fix relative links broken by the move

After a doc moves to a new subfolder, every link that used to reference siblings becomes wrong. Update with `replace_all`:

```
[…](file.md)        →  […](../sibling-folder/file.md)
[…](docs/file.md)   →  […](file.md)
```

Verify with a quick scan: open the moved file in a renderer (markdown preview) and click every link.

**NO STOP** — Mechanical.

---

## Step 08 — Add `.gitignore`

### 08.1 Pick the rule set

Standard ignores for the language/framework (`node_modules/`, `dist/`, `target/`, `.venv/`, etc.), plus any project-specific rules. Common project-specific rules:
- Ignore stray markdown except `README.md` and anything inside any `docs/` folder:
  ```
  *.md
  !README.md
  !docs/**
  !**/docs/**
  ```
- Ignore environment files except a checked-in template:
  ```
  .env
  .env.*
  !.env.example
  ```

**STOP — WAIT** if any rule is unusual (excludes README, excludes a tracked file).

### 08.2 Verify each rule with `git check-ignore -v`

Probe the rules against real and hypothetical files. A matching rule that **starts with `!`** means the file is *not* ignored — verify each expectation explicitly rather than trusting the pattern:

```bash
git check-ignore -v docs/spec/checklist.md     # should show !**/docs/**
git check-ignore -v README.md                  # should show !README.md
git check-ignore -v scratch.md                 # should show *.md (ignored)
```

**NO STOP** — Read-only.

---

## Step 09 — Commit and push

### 09.1 Stage with named files (not `git add .`)

`git add .` accidentally stages secrets, build output left over from a failed `.gitignore`, and editor backups. Stage explicitly:

```bash
git add <files>
git status   # confirm only the intended files are staged
```

**STOP — WAIT** before the commit if anything unexpected is in the staged set.

### 09.2 Write a clean commit message

One-line subject summarizing *why*, not *what* (the diff already shows what). Body only when there's context the diff can't carry.

**STOP — WAIT** — Commit is irreversible without rewriting history.

### 09.3 Push to the remote

```bash
git push -u origin <branch>
```

**STOP — WAIT** — Network-visible action. Even if the commit was approved, the push is a separate decision.

---

End of process. Project is shipped. For follow-up days that extend the same project, see [`../multi-day-docs-structure.md`](../multi-day-docs-structure.md) and the per-doc compilation skills at [`../../.claude/skills/`](../../.claude/skills/) (`/doc-architecture`, `/doc-schema-internal`, `/doc-api-contract`, `/doc-user-stories`, `/doc-concepts-map` — run only the ones whose material changed).

[← Back to index](README.md)
