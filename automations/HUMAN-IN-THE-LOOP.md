# Human-in-the-Loop — Running the Skills End-to-End

A walkthrough of what *you* (the human) actually do while the skills carry out the workflow. The agent runs the recipes; you make decisions, review work, and take a few active actions. This doc names every place you'll be asked to engage and what's expected of you when you are.

---

## The three modes the agent operates in

When a skill is running, the agent is in one of three modes at any moment:

| Mode | Marker in docs | What you do |
|---|---|---|
| **Autonomous** | *no marker* / `NO STOP — Agent-owned` | Nothing. The agent reads, writes, runs read-only commands. Don't interrupt unless something looks wrong. |
| **Approval gate** | **STOP — WAIT** | Read what the agent proposes, reply with a yes/no, approve/deny, or pick from a short list. Single-message reply. |
| **Active checkpoint** | **HUMAN TRIGGER — `<action>`** | Go do the thing the agent is asking for — review a diff, take a quiz, click through a UI, look at output. Reply with what you found, not just "approve". |

**The cadence**: most of a skill run is autonomous. Approval gates are short. HUMAN TRIGGERs are where your attention actually goes — they're the bottlenecks, by design, because that's where human judgement adds the most.

---

## Walkthrough — running a full day end-to-end

A day starts when you have a `requirements.md` in hand and ends when the work is shipped. Here's every place you'll be in the loop.

### `/plan-day` — Phase 1

| Where | Mode | What you do |
|---|---|---|
| Agent reads requirements + sibling refs | Autonomous | wait |
| Agent generates `checklist.md` | Autonomous | wait |
| **Skim review of the checklist** | **STOP — WAIT** | Open `docs/spec/checklist.md`. Confirm: every requirement bullet appears in some phase, nothing invented, Success Criteria preserved at bottom. Reply *approve* or call out missing/extra items. |

Time from your perspective: ~30 seconds at the end (just the review).

---

### `/learn-day` — Phase 2 (write notes)

| Where | Mode | What you do |
|---|---|---|
| Confirm `docs/notes/` is the right destination | **STOP — WAIT** | One yes/no. (Default is fine for almost everyone.) |
| Agent writes one note file per Learn item | Autonomous | wait |
| Agent ticks Learn items in checklist | Autonomous | wait |
| **Quiz invitation** | **HUMAN TRIGGER — take the quiz (or skip)** | The agent lists the new note files and asks: *"Run `/quiz` now? Reply: `quiz`, `quiz <note-file>`, or `skip`."* Pick one. Skipping is fine; the trigger exists so the option is offered. |

Time: ~1 minute decisions; the rest is wait.

---

### `/quiz` — Phase 2 (test, optional)

| Where | Mode | What you do |
|---|---|---|
| Agent generates one question | Autonomous | wait |
| **Answer the question** | **HUMAN TRIGGER — answer** | Read, think, reply. The agent grades and explains in 2–4 lines, then asks the next question. |
| Loop until ~8 questions or you say *stop* | (above) | Continue or call *stop* anytime. |
| Agent prints a scoresheet at the end | Autonomous | wait |

Time: ~10–15 minutes. Skip if pressed for time; quiz catches gaps cheaply but isn't load-bearing.

`/flowchart` follows the same shape — the agent draws an ASCII diagram and asks *"does this match your model?"*; you push back if not.

**Interleaving — no canonical order.** `/quiz` and `/flowchart` are freely interleavable. You can:
- Run one alone (just `/quiz` or just `/flowchart`).
- Run them in either order (quiz then flowchart, or flowchart then quiz).
- Switch between them mid-session at any point — *"draw the request lifecycle"* in the middle of a quiz, then *"resume quizzing"*, etc.
- Mix without sequencing — the agent can volunteer a flowchart when a quiz miss suggests the user is missing the *shape* of a flow, then go right back to quizzing.

`/learn-day`'s end-of-skill HUMAN TRIGGER offers `quiz`, `flowchart`, `mix`, or `skip` so you can pick your starting mode; from there, switching is just a chat message.

---

### `/scaffold` — Phase 3

| Where | Mode | What you do |
|---|---|---|
| Pre-flight checks (`node --version`, etc.) | Autonomous | wait — agent reports what it found |
| **Three tooling decisions** | **STOP — WAIT** | Reply with: (a) global install or one-shot runner; (b) subfolder or separate repo; (c) `npm` / `yarn` / `pnpm`. The agent will only proceed once all three are answered. |
| Agent runs the scaffold command | Autonomous | wait |
| Agent boots dev server in background, polls for ready | Autonomous | wait |
| Agent verifies default route returns expected output | Autonomous | wait |
| Agent stops dev server cleanly | Autonomous | wait |
| **Manual spot-check** *(UI projects only)* | **HUMAN TRIGGER — boot it and look at it** | Run the dev script yourself. Open the default route in a browser. Look for layout breaks, console errors, anything that "feels wrong." Report back: *all good* or list the issues. Skip for headless CLI/library projects. |

Time: ~30 seconds for the three decisions; ~1–2 minutes for the spot-check.

---

### Phase 4 — Diagnose *(methodology only, no skill)*

There's no `/diagnose` skill — diagnosis is judgment-based, not recipe-shaped, so it lives as methodology in [`automations/process/04-diagnose.md`](process/04-diagnose.md). When `/scaffold` or `/tdd-cycle` hits an unexpected verification result, the agent reads that file and walks you through:

| Where | Mode | What you do |
|---|---|---|
| Agent captures symptom precisely | Autonomous | wait |
| Agent runs OS-level introspection | Autonomous | wait |
| **Apply the smallest fix** *(if env-visible)* | **STOP — WAIT** | Confirm the fix the agent proposes (e.g., port change, dependency rebuild). |
| Agent re-runs the failed verification | Autonomous | wait |
| Agent saves env-quirk to memory file | Autonomous | wait |

Time: highly variable. Most environment surprises take 1–5 minutes to diagnose; some take an hour.

**Why no skill?** Diagnosis isn't a recipe — it's *capture symptom → pick the right inspection tool → apply the smallest fix*. A slash trigger doesn't help when the work is recognizing what's wrong; the methodology doc is the right shape.

---

### `/tdd-plan` — Phase 5 (planning)

| Where | Mode | What you do |
|---|---|---|
| Agent generates `tdd-plan.md` | Autonomous | wait |
| Agent reviews each cycle for trivially-green tests | Autonomous | wait |
| Agent appends an *Adjustments log* to the plan | Autonomous | wait |
| **Approve the pruned plan** | **HUMAN TRIGGER — review the plan** | Open `docs/spec/tdd-plan.md`. Read the *Adjustments log* — every change should make sense. Skim each cycle: would the RED test actually fail today? Reply *approve* or call out cycles you think were misjudged. |

Time: ~5 minutes for the plan review. This is the second-most valuable HITL point in the day (after each GREEN review). Don't rush it — a bad plan multiplies cost across every cycle.

---

### `/tdd-cycle` — Phase 5 (execute, run once per cycle)

For each cycle in `tdd-plan.md`, you run `/tdd-cycle` and ride this loop:

| Where | Mode | What you do |
|---|---|---|
| Branch from `main` (`tdd/<slug>`) | Autonomous | wait |
| Agent writes failing test (RED) | Autonomous | wait |
| Agent runs test — expects fail | Autonomous | wait |
| Agent commits RED | **STOP — WAIT** *(if `git status` shows surprise files)* | Glance at the staged set; usually one-touch approve. |
| Agent writes minimum impl (GREEN) | Autonomous | wait |
| Agent runs test — expects pass | Autonomous | wait |
| **Review the GREEN diff** | **HUMAN TRIGGER — review GREEN** | The agent shows `git diff` of unstaged changes + a one-line summary. You read the GREEN code asking: *smallest possible? scope creep? naming OK?* Reply *proceed* or specify what to adjust. **This is the single most valuable HITL point in the cycle.** |
| Agent commits GREEN | **STOP — WAIT** | Glance at staged set, approve. |
| Agent applies planned refactors *(if any)* | Autonomous | wait |
| Agent runs full suite — expects all green | Autonomous | wait |
| **Review the REFACTOR diff** | **HUMAN TRIGGER — review REFACTOR** | The agent shows the refactor diff. You read asking: *did it improve readability? did behavior sneak in?* Reply *proceed* or specify. Skip entirely if the cycle had "None yet" planned. |
| Agent commits REFACTOR | **STOP — WAIT** | Glance + approve. |
| Squash-merge to `main` | **STOP — WAIT** | Confirm the squashed diff before the merge commit lands. |
| Agent ticks the checklist item | Autonomous | wait |

Time per cycle: ~3–10 minutes depending on complexity. Most of it is your reading; the agent is fast.

After each cycle, return to `/tdd-cycle` for the next one. Repeat until `tdd-plan.md` has no remaining cycles.

---

### `/verify-day` — Phase 6

| Where | Mode | What you do |
|---|---|---|
| Agent boots dev server | Autonomous | wait |
| Agent walks through every Verify checklist item, recording output | Autonomous | wait |
| Agent reports: which passed, which failed | Autonomous — **but if any failed**, return to the relevant earlier phase | If everything passed, move to `/ship-day`. If anything failed, the agent flags which phase to return to (typically `/tdd-cycle` for missing/wrong behavior, or the diagnose methodology in `process/04-diagnose.md` for environment issues). |

Time: a minute or two for the report; longer if failures kick you back to an earlier phase.

---

### `/ship-day` — Phase 7

| Where | Mode | What you do |
|---|---|---|
| Reorganize files into `spec/`, `notes/`, `references/` | **STOP — WAIT** *(before destructive moves)* | Confirm the moves the agent proposes. |
| Fix relative links broken by moves | Autonomous | wait |
| Design `.gitignore` rules | **STOP — WAIT** *(if any rule is unusual — e.g., excludes README, excludes a tracked file)* | Approve or adjust. |
| Verify rules with `git check-ignore -v` | Autonomous | wait |
| Stage with named files (not `git add .`) | **STOP — WAIT** *(if anything unexpected is in `git status`)* | Glance + approve, or call out what shouldn't be staged. |
| Write commit message + commit | **STOP — WAIT** | Approve the message. Commit is irreversible without history rewrite. |
| Push to remote | **STOP — WAIT** | Push is network-visible. Even if commit was approved, push is a separate decision. |

Time: ~1–2 minutes if everything's clean; longer if reorganization is non-trivial.

---

### `/doc-*` — Post-Ship (or end of day)

The previous monolithic `/compile-docs` was split into five per-doc skills. Run only the ones whose underlying material changed this day. Each is independently runnable and idempotent.

| Skill | When to run | Time |
|---|---|---|
| `/doc-architecture` | Whenever folder layout, layers, or module responsibilities change | ~1 min wait + brief review |
| `/doc-schema-internal` | After any cycle that adds or modifies a type, entity, or DTO | ~1 min wait |
| `/doc-api-contract` | After any cycle that adds or changes an endpoint. Skip for non-API projects. | ~1–2 min wait + spot-check one example via `curl` |
| `/doc-user-stories` | Before Build (as design) and after Build (as confirmation). The same doc serves both. | ~2 min wait + coverage check |
| `/doc-concepts-map` | **Last** — needs real `src/` to point at. Skip if Build was minimal. | ~2 min wait + coverage review |

For each one:
- **Autonomous** for the bulk: agent reads source, writes/refines the doc, cross-links to source files.
- **STOP — WAIT** if the agent's diff would substantively change a previously-approved claim.
- **HUMAN TRIGGER** at the end of `/doc-user-stories` (coverage check), `/doc-concepts-map` (coverage review), and `/doc-api-contract` (example freshness when refining). The agent surfaces what to verify; you confirm or push back.

If any skill flags an **inconsistency between days** (e.g., day-3 said `id: number`, day-4's code uses `id: string`), reconcile before continuing. Don't let inconsistencies compound.

Time, all five back-to-back on a clean day: ~10 minutes. Often you'll only run 1–2 because not every day touches every doc.

---

## When to interrupt the agent (override the autonomous mode)

Skills are designed to do the right thing autonomously between checkpoints. But interrupt if you spot:

- **Scope creep** during a Build cycle — agent is adding error handling or a field the test didn't drive. Stop, redirect, restart from RED.
- **Wrong file path** — agent is writing to `docs/` when it should be `docs/spec/`. Stop, correct.
- **A "successful" message that looks suspicious** — `"Nest application successfully started"` but `curl` returned someone else's HTML (the day-3 port-3000 case). Stop, follow the diagnose methodology in `process/04-diagnose.md` instead of moving on.
- **The agent silently picked an option** when the choice felt non-trivial. Ask it to surface the choice.

A clean interrupt is just `wait` or `stop` in chat. The agent should ask what's wrong and accept redirection without unwinding completed work.

---

## Recovery patterns

| What broke | What to do |
|---|---|
| RED test passes unexpectedly during cycle | Cycle is trivially green — go back to `/tdd-plan` Step 2 (the review) for that cycle |
| GREEN proof fails (test still red after impl) | Follow `process/04-diagnose.md` for the cycle, then re-attempt GREEN with a smaller change |
| Full suite turns red after a refactor | Refactor changed behavior — `git reset --hard HEAD` on the branch, split the change into a properly-driven new cycle |
| Squash merge dropped a commit message detail | The branch reflog still has the original commits; can amend the squash if caught immediately |
| Dev server won't stop cleanly | `TaskStop <task-id>` if you know the id; otherwise `Get-Process node` + `Stop-Process -Id <pid>` |
| Day's work isn't done at the end of session | Add `## Outstanding — carried forward` block to bottom of `checklist.md`. Next session re-reads checklist first. |

---

## What "good" feels like

When the skills are running well, your day looks like:

- 2–3 short approval gates per phase
- 1 deep review per Build cycle (the GREEN diff)
- Maybe a quiz session somewhere in Phase 2
- A final ship review

Most of the actual *time* is the agent working. Your *attention* is at the HITL checkpoints. That's the whole design.

If you find yourself constantly correcting the agent between checkpoints, the relevant skill probably needs sharpening — open the corresponding file in [`automations/`](.) and tighten its prompt.
