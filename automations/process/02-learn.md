# Phase 2 — Learn

[← Back to index](README.md) · Previous: [Phase 1 — Plan](01-plan.md) · Next: [Phase 3 — Setup](03-setup.md)

---

## Rules

- No code is written in this phase.
- For every "Learn" item in the checklist, the agent produces a focused note.
- One file per concept — keeps each topic short, separately commitable, and independently revisitable.
- Notes go into `<project>/docs/notes/`.

---

## Step 02 — Generate conceptual notes

### 02.1 Confirm the destination folder

Default location: `<project>/docs/notes/`. User may override.

**STOP — WAIT** — Trivial decision but worth confirming once.

### 02.2 Agent writes one file per concept

**Agent prompt**
> "Execute the Learn step. Write notes inside `docs/notes/`."

Per-file constraints:
- One concept per file.
- Filename uses an ordering prefix: `01-…md`, `02-…md`. Pick the prefix from the checklist's Learn-item order.
- Body lead-in: **what it is**, **why it matters**, then a short **key insight** at the end.
- Use small tables or code blocks where they add clarity; avoid filler.

**NO STOP** — Agent-owned.

### 02.3 Agent ticks Learn items in the checklist

The Learn section of `checklist.md` is updated to `- [x]` with relative links to the corresponding note files (e.g., `[…](../notes/01-….md)`).

**NO STOP** — Agent-owned.

### 02.4 Invite the user to test the notes

The agent surfaces the list of notes it just wrote and asks: *"Want to run [`../03-interactive-learning.md`](../03-interactive-learning.md) — Mode A (Quiz me) — before scaffolding? It's the cheapest place to catch conceptual gaps."*

The user's options:
- **Yes** → the agent runs Mode A; the quiz scoresheet at the end identifies any notes worth re-reading before continuing.
- **Skip** → the agent moves directly to Phase 3 (Setup). The user can always run interactive learning later.
- **Drill one note** → the agent runs Mode A scoped to one note ("quiz me only on `03-dependency-injection.md`").

**HUMAN TRIGGER — take the quiz (or explicitly skip).** Skipping is fine — the trigger exists so the option is offered, not forced.

---

## Reinforce via interactive learning

The interactive learning modes live in [`../03-interactive-learning.md`](../03-interactive-learning.md): in-chat quizzes (Mode A), ASCII flowcharts (Mode B), and both in sequence (Mode C). Catches conceptual gaps cheaply (chat exchange) instead of expensively (during debug). Step 02.4 above is the moment in the process to invoke it.

## Runnable counterpart

The runnable automation for this phase is [`../02-checklist-to-notes.md`](../02-checklist-to-notes.md).

Next: [Phase 3 — Setup](03-setup.md)
