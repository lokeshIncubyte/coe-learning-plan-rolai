# Multi-Day Docs Structure

Recommended docs layout for projects that span multiple days, where each day adds incremental work (notes, references, requirements) but the project itself is one continuous codebase.

The principle: **per-day work accumulates in `days/<day-N>/`; project-wide compilations live one level up.**

---

## The split

| Layer | What it holds | Updated by |
|---|---|---|
| **Per-day** (`docs/days/<day-N>/`) | That day's `spec/`, `notes/`, `references/` | The day's work session |
| **Project-wide** (`docs/`) | Compilations: `architecture.md`, `schema-internal.md`, `api-contract.md`, `user-stories.md`, `<framework>-concepts-map.md` | Re-run the relevant `/doc-*` skill(s) at the end of each day — see [`.claude/skills/`](../.claude/skills/) for the per-doc skills |

**Why this split?**
- Per-day folders are append-only: day-3's notes don't change when day-4 happens. Diffs stay clean.
- Project-wide docs are *syntheses*: they reflect the cumulative state of the project, regenerated whenever new material arrives. Any reader can open `architecture.md` and see the *current* layout without paging through five days of notes to reconstruct it.
- The per-day notes are still canonical for *what was learned when*; the project-wide docs are canonical for *what the project is now*.

---

## Recommended layout

```
<project>/
├── src/
├── package.json (or equivalent)
├── README.md
├── .gitignore
└── docs/
    ├── architecture.md                ← /doc-architecture, project-wide
    ├── schema-internal.md             ← /doc-schema-internal, project-wide
    ├── api-contract.md                ← /doc-api-contract, project-wide
    ├── user-stories.md                ← /doc-user-stories, project-wide
    ├── <framework>-concepts-map.md    ← /doc-concepts-map, project-wide
    └── days/
        ├── day-3/
        │   ├── spec/
        │   │   ├── requirements.md
        │   │   └── checklist.md
        │   ├── notes/
        │   │   ├── 01-<concept>.md
        │   │   ├── 02-<concept>.md
        │   │   └── …
        │   └── references/
        │       └── <external-material>
        ├── day-4/
        │   ├── spec/
        │   │   ├── requirements.md
        │   │   └── checklist.md
        │   ├── notes/
        │   └── references/
        └── …
```

---

## Migrating from the day-3 layout

The current day-3 layout is:

```
day-3/task-management-backend/docs/
├── notes/01-…05-…md
├── references/<pdf>
└── spec/{requirements,checklist}.md
```

When day-4 first extends this project, the recommended migration is:

1. **Move day-3's working folders into `days/day-3/`:**
   ```
   day-3/task-management-backend/docs/spec       → docs/days/day-3/spec
   day-3/task-management-backend/docs/notes      → docs/days/day-3/notes
   day-3/task-management-backend/docs/references → docs/days/day-3/references
   ```
2. **Run the per-doc skills** to (re)generate project-wide docs from the now-relocated material — `/doc-architecture`, `/doc-schema-internal`, `/doc-api-contract`, `/doc-user-stories`, `/doc-concepts-map`. Run only the ones whose underlying material changed.
3. **Update `checklist.md`'s relative links** — most will need a `..` prefix shift (sibling → cousin).

After step 3, day-4 starts by creating `docs/days/day-4/{spec,notes,references}/` and populating it the same way day-3 was populated.

The project itself stays at `day-3/task-management-backend/` — moving the project root would break commit history and existing tooling. The day folder names in the repo (`day-3/`, `day-4/`) just identify *when* a day's contributions started; they don't bound the project.

---

## Where day-N's `requirements.md` actually originates

Two patterns, both valid:

**Pattern A — requirements arrive in `day-N/`, work happens in `<project>/`:**
```
day-4/requirements.md                                         ← arrives here
   ↓ (automation 01 reads it, writes to:)
day-3/task-management-backend/docs/days/day-4/spec/checklist.md
day-3/task-management-backend/docs/days/day-4/spec/requirements.md   ← copy, for self-containment
```

**Pattern B — requirements drop directly into the project's day folder:**
```
day-3/task-management-backend/docs/days/day-4/spec/requirements.md  ← arrives here directly
```

Pattern A matches how this repo currently surfaces new days (each `day-N/` is a top-level folder). Pattern B is cleaner if the project becomes the unit of work and day folders fade. Pick one and stick with it; switching mid-stream is the path of pain.

---

## Project-wide docs are *not* day-versioned

Don't write `architecture-v3.md`, `architecture-v4.md`, etc. The single `architecture.md` is regenerated on each compile. If you need the historical version of a doc, `git log -p docs/architecture.md` is the source of truth — the file system is for *current* state.

The per-day notes and specs already provide the historical record of *what was learned* and *what was scoped* on each day. The project-wide docs provide the snapshot of *what the project is now*.

---

## Cross-links

- Per-doc skills that produce the project-wide docs: [`.claude/skills/doc-*/SKILL.md`](../.claude/skills/) — one skill per doc, individually invokable
- Methodology context: [`process/`](process/README.md)
