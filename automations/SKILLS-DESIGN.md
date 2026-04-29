# Skills — Design & Index

Slash-invokable skills that automate the workflow defined in [`automations/`](.). Each skill is a thin wrapper: it tells the agent which automation/process file to read and follow when you type `/<skill-name>`. The actual *substance* (rules, prompts, edge cases) lives in `automations/`; skills just give it a memorable name and a slash trigger.

---

## Why skills, not just automations

The automation files are *recipes you paste into a session*. Skills are *recipes the agent already knows about*. With skills installed, you don't paste a 50-line prompt — you type `/plan-day` and the agent loads the recipe itself.

The trade-off: skills add slight context-window cost (each skill's `name` + `description` from the SKILL.md frontmatter loads at session start so the model can pick the right one). Bodies stay on disk and only load when a skill is invoked. Worth it for things you do often; not worth it for one-shots.

---

## The powers being executed

Across every automation in this project, these are the discrete capabilities the agent exercises. Each power is a *thing the agent does* — not a phase, not a deliverable.

### Reading & analysis

1. **Read structured input** — `requirements.md`, `checklist.md`, `src/`, day-2 reference docs (style templates), PDFs (when tooling allows)
2. **Cross-link claims to source** — every doc claim points at the file/line that backs it
3. **OS-level introspection** — `Get-NetTCPConnection`, `lsof`, `ps`, `git status`, build-output inspection (used in diagnose)

### Generation

4. **Phased checklist generation** — group raw bullets into Learn / Setup / Build / Validate / Verify / Ship; preserve Success Criteria verbatim
5. **Per-concept note generation** — one focused file per Learn item with consistent structure (lead-in, why, key insight)
6. **Quiz question generation** — multiple choice, true/false-with-reasoning, predict-the-output, explain-in-2-sentences; calibrated difficulty
7. **ASCII flowchart generation** — runtime sequence diagrams for startup/DI, request lifecycle, validation paths
8. **TDD cycle generation** — break Build items into smallest RGR cycles with structured per-cycle template
9. **Project-wide doc compilation** — synthesize per-day notes/specs into architecture / schema / API / user-stories / concepts-map docs
10. **Gitignore rule design** — language defaults plus project-specific rules (markdown carve-outs, env-file patterns)

### Orchestration

11. **Background process management** — launch dev server with `run_in_background`, poll output for ready signal, terminate cleanly
12. **Branch-per-cycle TDD execution** — `tdd/<slug>` branch, RED-commit, GREEN-commit, REFACTOR-commit, squash-merge to `main`
13. **Pre-flight + tooling negotiation** — read-only environment check, three-decision negotiation (CLI install style, project location, package manager)
14. **File reorganization with link healing** — move files into `spec/`, `notes/`, `references/` subfolders; fix every relative link broken by the move

### Quality gates

15. **Test-prune review** — identify RED tests that are trivially green from the start; remove or strengthen them
16. **Verification loop** — run every Verify checklist item, record actual output, surface failures
17. **`git check-ignore -v` probing** — verify gitignore rules behave as intended against real and hypothetical files

### Persistence & memory

18. **Project memory** — write environment-specific quirks to `~/.claude/projects/<project>/memory/<topic>.md` so future sessions don't re-discover them
19. **Outstanding-work hand-off** — record carried-forward items at the bottom of `checklist.md` for the next session

### Human-in-the-loop

20. **STOP — WAIT** — pause for binary user approval (yes/no, approve/deny)
21. **HUMAN TRIGGER** — pause and invite user to actively do something (review code, take quiz, manually verify UI)
22. **Outstanding-question surfacing** — when something is ambiguous, the agent surfaces the choice rather than silently picking

---

## Modular skills (the framework)

The 22 powers above group into **14 skills**. Most phase-mapped skills are *pointer-style* (thin wrapper → canonical automation). The five **`/doc-*`** skills are *self-contained* (inline prompt, no chain-following) — they replaced a single overloaded `/compile-docs` skill that produced five docs in one invocation.

**Phase 4 (Diagnose) is intentionally not a skill.** Diagnosis is judgment-based — capture symptom, inspect the right layer, apply the smallest fix — not a recipe that benefits from a slash trigger. The methodology lives in [`automations/process/04-diagnose.md`](process/04-diagnose.md); other skills hand off to that doc when verification fails unexpectedly.

### Phase-mapped skills (9)

| # | Skill | Powers it bundles | Maps to |
|---|---|---|---|
| 1 | [`/plan-day`](../.claude/skills/plan-day/SKILL.md) | 1, 4 | [`automations/01-requirements-to-checklist.md`](01-requirements-to-checklist.md) + [`process/01-plan.md`](process/01-plan.md) |
| 2 | [`/learn-day`](../.claude/skills/learn-day/SKILL.md) | 1, 5 | [`automations/02-checklist-to-notes.md`](02-checklist-to-notes.md) + [`process/02-learn.md`](process/02-learn.md) |
| 3 | [`/quiz`](../.claude/skills/quiz/SKILL.md) | 6 | [`automations/03-interactive-learning.md`](03-interactive-learning.md) (Mode A) |
| 4 | [`/flowchart`](../.claude/skills/flowchart/SKILL.md) | 7 | [`automations/03-interactive-learning.md`](03-interactive-learning.md) (Mode B) |
| 5 | [`/scaffold`](../.claude/skills/scaffold/SKILL.md) | 11, 13, 18 | [`automations/04-scaffold-project.md`](04-scaffold-project.md) + [`process/03-setup.md`](process/03-setup.md) |
| 6 | [`/tdd-plan`](../.claude/skills/tdd-plan/SKILL.md) | 8, 15 | [`automations/05-tdd-cycle-breakdown.md`](05-tdd-cycle-breakdown.md) |
| 7 | [`/tdd-cycle`](../.claude/skills/tdd-cycle/SKILL.md) | 12, 20, 21 | [`process/05-build.md`](process/05-build.md) |
| 8 | [`/verify-day`](../.claude/skills/verify-day/SKILL.md) | 11, 16 | [`process/06-verify.md`](process/06-verify.md) |
| 9 | [`/ship-day`](../.claude/skills/ship-day/SKILL.md) | 10, 14, 17, 20 | [`process/07-ship.md`](process/07-ship.md) |

### Per-doc skills (5, self-contained)

| # | Skill | Produces | Style template |
|---|---|---|---|
| 10 | [`/doc-architecture`](../.claude/skills/doc-architecture/SKILL.md) | `<project>/docs/architecture.md` | [`day-2/picsum-lab/docs/architecture.md`](../day-2/picsum-lab/docs/architecture.md) |
| 11 | [`/doc-schema-internal`](../.claude/skills/doc-schema-internal/SKILL.md) | `<project>/docs/schema-internal.md` | [`day-2/picsum-lab/docs/schema-app.md`](../day-2/picsum-lab/docs/schema-app.md) |
| 12 | [`/doc-api-contract`](../.claude/skills/doc-api-contract/SKILL.md) | `<project>/docs/api-contract.md` | [`day-2/picsum-lab/docs/schema-remote.md`](../day-2/picsum-lab/docs/schema-remote.md) (direction flipped) |
| 13 | [`/doc-user-stories`](../.claude/skills/doc-user-stories/SKILL.md) | `<project>/docs/user-stories.md` | [`day-2/picsum-lab/docs/user-stories.md`](../day-2/picsum-lab/docs/user-stories.md) |
| 14 | [`/doc-concepts-map`](../.claude/skills/doc-concepts-map/SKILL.md) | `<project>/docs/<framework>-concepts-map.md` | [`day-2/picsum-lab/docs/typescript-concepts.md`](../day-2/picsum-lab/docs/typescript-concepts.md) |

Each doc skill bundles powers 2 (cross-link to source) and 9 (project-wide doc gen). They're independently runnable — refresh just one doc, or chain all five at end of day. They aggregate across days automatically (read every `docs/days/<day-N>/` folder).

Powers **19, 22** (outstanding hand-off, ambiguity surfacing) are cross-cutting — they happen inside every skill, not as a dedicated skill.

---

## Typical day flow

```
/plan-day             →  checklist.md             (Phase 1)
/learn-day            →  notes/*.md               (Phase 2 write)
/quiz                 →  in-chat dialogue         (Phase 2 test, optional)
/scaffold             →  src/, dev verified       (Phase 3)
[Phase 4 — Diagnose: methodology in process/04-diagnose.md, no skill]
/tdd-plan             →  tdd-plan.md              (Phase 5 plan)
/tdd-cycle  ×N        →  branches squashed        (Phase 5 execute, looped)
/verify-day           →  smoke test results       (Phase 6)
/ship-day             →  .gitignore + commit      (Phase 7)

# end-of-day doc refresh — run only the ones whose material changed
/doc-architecture     →  architecture.md
/doc-schema-internal  →  schema-internal.md
/doc-api-contract     →  api-contract.md
/doc-user-stories     →  user-stories.md
/doc-concepts-map     →  <framework>-concepts-map.md
```

For multi-day extensions, see [`automations/multi-day-docs-structure.md`](multi-day-docs-structure.md).

---

## Where skills live

These are **project-local skills** in **folder-based format** at `.claude/skills/`:

```
.claude/skills/
├── plan-day/SKILL.md
├── learn-day/SKILL.md
├── … (14 total, one folder per skill)
```

Each skill is a folder with a `SKILL.md` inside. Folder name = skill name = slash trigger (`/plan-day` etc.). **No stray `.md` files at the `.claude/skills/` root** — they would be ambiguous in skill discovery and might load descriptions for nothing.

Companion docs live in `automations/`, **not** in `.claude/skills/`:
- [`SKILLS-DESIGN.md`](SKILLS-DESIGN.md) — this file
- [`HUMAN-IN-THE-LOOP.md`](HUMAN-IN-THE-LOOP.md) — usage guide

These are available for human reference but won't be picked up as skills.

To make skills globally available:

```bash
# copy folder-based skills to user-level so they work in any project
cp -r .claude/skills/* ~/.claude/skills/
```

User-level skills with the same names will clash with the project's. Pick one location.

---

## How to extend

When a new step recurs across days and is mechanical enough to give a slash trigger:

1. Add the runnable recipe to [`automations/`](.) (kebab-case, numbered if it fits the chain).
2. Create a thin skill wrapper at `.claude/skills/<name>/SKILL.md` pointing at the new automation. (Folder-based — each skill in its own subfolder so non-skill `.md` files at the skills root aren't confused for skills.)
3. Update this README's powers list and skill table.

Folder layout:

```
.claude/skills/<name>/
└── SKILL.md
```

`SKILL.md` format:

```markdown
---
name: skill-name
description: One-sentence trigger phrase the agent uses to decide when to invoke
---

# Skill: <Name>

Brief description.

## When invoked

Read [link to canonical automation] and follow its protocol. Surface STOP — WAIT and HUMAN TRIGGER points to the user without skipping.
```

**Loading semantics**: Claude Code loads each skill's `name` + `description` from frontmatter at session start (so the model can pick the right one). The body of `SKILL.md` only loads when the skill is invoked via `/<name>`.

---

## Companion docs

- [`HUMAN-IN-THE-LOOP.md`](HUMAN-IN-THE-LOOP.md) — how the user actually rides the workflow when running these skills end-to-end
