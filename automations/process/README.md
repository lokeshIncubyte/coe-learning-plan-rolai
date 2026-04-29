# Process — Detailed Steps

A reusable methodology for taking a project from a raw `requirements.md` file to a running, organized, shipped codebase. Each phase has its own modular file with rules, steps, and **STOP — WAIT** vs. **NO STOP — Agent-owned** markers describing what the agent (Claude Code) may do unattended versus what requires user approval.

This document is intentionally project-agnostic. Specific command names (`nest`, `vite`, `cargo`, etc.), filenames, ports, and language-specific conventions are referenced as placeholders — `<framework-cli>`, `<project-name>`, `<port>`. Each project's own `docs/spec/` folder records the concrete instantiation for that project.

---

## Conventions used throughout

| Notation | Meaning |
|---|---|
| `<placeholder>` | A name the project fills in (`<project-name>`, `<framework-cli>`, `<port>`) |
| **STOP — WAIT** | Step requires explicit user **approval** before the agent acts (yes/no, approve/deny, pick from options). Used for installs, commits, pushes, and any other irreversible side effect. |
| **HUMAN TRIGGER — `<action>`** | Step requires the user to **actively do something** before the agent continues — review code, take a quiz, manually verify behavior, click through a UI. The agent pauses and surfaces what to do; the user replies with their findings. |
| **NO STOP — Agent-owned** | Step is read-only or trivially reversible (write a file, edit a string, run a query). Agent proceeds. |
| **Agent prompt** | A literal prompt the user gives the agent. Quoted prompts are the canonical phrasing — paraphrase but keep the intent. |
| **Reference docs** | Links to other docs the agent should read before acting on the step. |

**STOP — WAIT vs HUMAN TRIGGER:** Both pause the agent. The difference is the *kind of involvement* the user provides next.
- `STOP — WAIT` = "approve this and I'll proceed" (decision gate)
- `HUMAN TRIGGER` = "go do this thing yourself, then tell me what you found" (active user work)

---

## Phase shape (overview)

```
1. Plan       2. Learn       3. Setup       4. Diagnose      5. Build       6. Verify      7. Ship
   ↓             ↓              ↓              (conditional)    ↓              ↓              ↓
checklist     concept         scaffolded     unexpected       features       smoke          .gitignore
              notes           project        results          implemented    tests          + commit
                              + verified     handled                         pass           + push
```

A typical day starts in **Plan** and finishes in **Ship**. **Diagnose** is conditional — only triggered when a verification step in Setup or Build returns something unexpected.

---

## Phases

| # | Phase | File | One-liner |
|---|---|---|---|
| 1 | **Plan** | [`01-plan.md`](01-plan.md) | Read requirements; produce a phased checklist |
| 2 | **Learn** | [`02-learn.md`](02-learn.md) | Write one focused note per Learn item |
| 3 | **Setup** | [`03-setup.md`](03-setup.md) | Pre-flight, scaffold, verify boot |
| 4 | **Diagnose** *(conditional)* | [`04-diagnose.md`](04-diagnose.md) | Triage when verification returns the unexpected |
| 5 | **Build** | [`05-build.md`](05-build.md) | Implement features one item at a time |
| 6 | **Verify** | [`06-verify.md`](06-verify.md) | Manual / scripted smoke test |
| 7 | **Ship** | [`07-ship.md`](07-ship.md) | Organize, gitignore, commit, push |

Each phase file is self-contained — its rules, steps, and exit criteria live there. Read the README for the map; read the phase file when you're inside the phase.

---

## Outstanding-work convention

When a phase is partially complete (the day ran out, a blocker appeared, or the rest is intentionally deferred), record what's left at the bottom of `checklist.md` as:

```markdown
## Outstanding — carried forward

- [ ] <next-phase>: <what's left>
- [ ] <next-phase>: <what's left>
```

Each subsequent session re-reads `checklist.md` first, picks up from the outstanding list, and follows the same phase rules.

---

## Project doc layout reference

The structure this methodology produces:

```
<repo-root>/
├── automations/
│   ├── 0X-*.md                         ← runnable agent prompts (one per transition)
│   └── process/
│       ├── README.md                   ← this document
│       └── 01-plan.md … 07-ship.md     ← per-phase modules
├── <project>/
│   ├── src/
│   ├── .gitignore
│   ├── README.md
│   └── docs/
│       ├── spec/
│       │   ├── requirements.md
│       │   └── checklist.md
│       ├── notes/
│       │   ├── 01-<concept>.md
│       │   ├── 02-<concept>.md
│       │   └── …
│       └── references/
│           └── <external-material>
└── <other-project>/
    └── …
```

**Cross-cutting** content (this methodology, shared style guides, cross-project decisions) lives in repo-level folders (`automations/`, `automations/process/`).

**Project-specific** content (what *this* project must build, what *this* project taught the user, materials supplied for *this* project) lives in **`<project>/docs/`**.

For multi-day projects, see [`../multi-day-docs-structure.md`](../multi-day-docs-structure.md) — per-day work accumulates under `<project>/docs/days/<day-N>/`, project-wide compilations live one level up.
