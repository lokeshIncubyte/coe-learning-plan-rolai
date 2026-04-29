# Automations

Day-agnostic, drop-in agent prompts for the workflow used in this learning plan. Each automation is a self-contained markdown file with a copy-pasteable prompt block — paste it into a fresh Claude Code session, fill in the placeholders, and the agent does the step.

These files are abstractions of the actual day-3 work captured in `day-3/task-management-backend/docs/`. The full methodology — rules, STOP/NO STOP markers, edge cases — lives in [`process/`](process/README.md), split into one file per phase. Use the process docs to understand *why*; use these files to actually *do*.

---

## The chain

```
requirements.md
       │
       ▼
[ 01-requirements-to-checklist.md ]
       │ produces  →  docs/spec/checklist.md
       ▼
[ 02-checklist-to-notes.md ]
       │ produces  →  docs/notes/01-…N-…md
       ▼
[ 03-interactive-learning.md ]    ← optional but recommended; reinforces notes via quizzes + flowcharts
       │ produces  →  in-chat dialogue (no file output)
       ▼
[ 04-scaffold-project.md ]
       │ produces  →  src/, package.json, dev server verified
       ▼
[ 05-tdd-cycle-breakdown.md ]     ← Build planning: split Build items into smallest RGR cycles, prune trivially-green tests
       │ produces  →  docs/spec/tdd-plan.md
       ▼
       ⋮  (Build cycles per `process/05-build.md` — branch → RED → GREEN → REFACTOR → squash-merge)
       ⋮  (Verify / Ship phases — see [`process/`](process/README.md) for full coverage)
       ▼
   end-of-day per-doc compilation — runnable as 5 self-contained skills, not automations:
   /doc-architecture, /doc-schema-internal, /doc-api-contract, /doc-user-stories, /doc-concepts-map
   (see [`.claude/skills/`](../.claude/skills/) — run only the ones whose material changed)
```

---

## Files in this folder

| # | File | Purpose | Outputs |
|---|---|---|---|
| 01 | [`01-requirements-to-checklist.md`](01-requirements-to-checklist.md) | Convert raw requirements into a phased checklist | `docs/spec/checklist.md` |
| 02 | [`02-checklist-to-notes.md`](02-checklist-to-notes.md) | Generate one focused note per Learn item | `docs/notes/01-…N-…md` |
| 03 | [`03-interactive-learning.md`](03-interactive-learning.md) | Reinforce notes via in-chat quizzes and ASCII flowcharts | (chat-only) |
| 04 | [`04-scaffold-project.md`](04-scaffold-project.md) | Pre-flight + tooling decisions + scaffold + verify boot | working project skeleton |
| 05 | [`05-tdd-cycle-breakdown.md`](05-tdd-cycle-breakdown.md) | Break Build items into smallest RGR cycles; prune trivially-green tests | `docs/spec/tdd-plan.md` |
| — | [`multi-day-docs-structure.md`](multi-day-docs-structure.md) | Recommended docs layout when day-N+1 extends the same project | (reference) |
| — | [`SKILLS-DESIGN.md`](SKILLS-DESIGN.md) | Powers list, skill index, design rationale for `.claude/skills/` | (reference) |
| — | [`HUMAN-IN-THE-LOOP.md`](HUMAN-IN-THE-LOOP.md) | Phase-by-phase walkthrough of running the skills end-to-end | (reference) |

**Note**: per-doc compilation (`architecture.md`, `schema-internal.md`, etc.) is no longer an automation file in this folder. It moved to **5 self-contained skills** under [`.claude/skills/`](../.claude/skills/) — `/doc-architecture`, `/doc-schema-internal`, `/doc-api-contract`, `/doc-user-stories`, `/doc-concepts-map`. Reason: each doc is independently runnable, idempotent, and avoids the chain-following overhead the previous monolithic `06-compile-project-docs` had.

---

## How these relate to the process modules

| Process phase | Process module | Automation file |
|---|---|---|
| Phase 1 — Plan | [`process/01-plan.md`](process/01-plan.md) | `01-requirements-to-checklist.md` |
| Phase 2 — Learn (write) | [`process/02-learn.md`](process/02-learn.md) | `02-checklist-to-notes.md` |
| Phase 2 — Learn (test) | [`process/02-learn.md`](process/02-learn.md) | `03-interactive-learning.md` |
| Phase 3 — Setup | [`process/03-setup.md`](process/03-setup.md) | `04-scaffold-project.md` |
| Phase 4 — Diagnose | [`process/04-diagnose.md`](process/04-diagnose.md) | *(no automation — diagnose is judgment-based; see process module)* |
| Phase 5 — Build (plan) | [`process/05-build.md`](process/05-build.md) | `05-tdd-cycle-breakdown.md` |
| Phase 5 — Build (execute) | [`process/05-build.md`](process/05-build.md) | *(per-cycle protocol in the process module — branch / RED / GREEN / REFACTOR / squash-merge)* |
| Phase 6 — Verify | [`process/06-verify.md`](process/06-verify.md) | *(no automation yet)* |
| Phase 7 — Ship | [`process/07-ship.md`](process/07-ship.md) | *(no automation yet)* |
| Doc compilation (post-Build) | — | 5 self-contained skills at [`.claude/skills/doc-*/SKILL.md`](../.claude/skills/) |

---

## Conventions used in every automation file

- `<placeholder>` — a value you fill in (`<project-path>`, `<framework-cli>`, `<port>`, `<day-N>`)
- **Inputs** section — files / decisions the user must provide before running
- **Outputs** section — what the agent will produce
- **Prompt** — the literal text to paste into the agent
- Three pause markers inside prompts:
  - **STOP — WAIT** — decision gate; the agent waits for user approval (yes/no, approve/deny)
  - **HUMAN TRIGGER — `<action>`** — the user must actively do something (review code, take a quiz, manually verify a UI) before the agent continues
  - **NO STOP — Agent-owned** — read-only or trivially reversible; agent proceeds

---

## Adding new automations

If a step recurs across days and is mechanical enough to script, add it here. Naming: zero-padded number prefix matching the phase (`06-…`, `07-…`), kebab-case rest. Keep each file focused on **one transition** (input → output). Cross-link from the README's chain diagram and table.
