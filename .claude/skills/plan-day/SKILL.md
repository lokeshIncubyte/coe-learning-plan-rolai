---
name: plan-day
description: Read a requirements.md and produce a phased checklist for a day's work.
---

# plan-day

## Inputs

- A requirements file path (typically `<project>/docs/spec/requirements.md`)
- Any sibling reference files (PDFs, design docs) in the same folder

## Output

`<project>/docs/spec/checklist.md` (or `<project>/docs/days/<day-N>/spec/checklist.md` for multi-day extensions)

## Steps

1. Read the requirements file and any sibling reference docs. If a reference can't be parsed (e.g., PDF tooling unavailable), flag it rather than guessing — silent guesses leak into later phases.
2. Group every requirement bullet into one of these phases, in order:
   ```
   Learn → Setup → Build → Validate → Verify → Ship
   ```
   Adjust per project type — a frontend project may insert *Style*; a library project may drop *Verify* in favor of *Document*.
3. For each phase, write a section heading (`## 1. Learn — concepts before code`, etc.) and list its items as markdown checkboxes (`- [ ]`).
4. **Preserve any *Success Criteria* list from the requirements verbatim** under a `## Success Criteria (from requirements)` heading at the bottom. Final gate — nothing dropped.
5. After writing, summarize how each requirement bullet maps to a phase so the user can spot misplaced items.

## HITL checkpoint

**STOP — WAIT** after the file is written. The user confirms:
- Every requirement bullet is represented somewhere
- Phase ordering is reasonable
- No invented work was added beyond the requirements
