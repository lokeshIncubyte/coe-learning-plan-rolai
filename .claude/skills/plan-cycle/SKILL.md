---
name: plan-cycle
description: Accept any planned change input (checklist item, feature plan, structured list, or doc reference), decompose into minimal TDD cycle files, show a summary, and wait for approval before writing. Works best when all code changes are already planned.
---

# plan-cycle

> **Works best when all code changes are already planned.** The skill translates a plan into testable cycles — it is not a design tool. Pass it a spec, a list of changes, or a checklist item; it will tell you how to TDD it. If the plan is vague, the cycles will be vague.

## Inputs

One of:
- **Checklist reference** — `checklist:§3-4` → reads `<project>/docs/spec/checklist.md`
- **Single item** — `"TasksService.getById() returns task or throws"` (inline text)
- **Feature plan** — `"Implement full CRUD for tasks with validation"` (multi-sentence)
- **Structured list** — a numbered or bulleted list of planned changes, pasted inline
- **Doc reference** — `spec:section-3` or a file path → reads the referenced file

Also reads:
- `<project>/src/` — existing code context
- `<project>/cycles/` — highest existing prefix (default `000` if absent)

## Output

One or more cycle files written to `<project>/cycles/NNN-<kebab-slug>.md` after user approval. Directory `<project>/cycles/` is created if absent.

## Rules

- **Atomic signals**: one method, one validation rule, one DTO field, one route delegating to an already-tested service, one error path on an existing method.
- **Compound signals**: two distinct behaviors, spans independently testable layers, GREEN touches >3 unrelated files, mixes validation with happy path.
- **Ordering**: service-layer cycles precede controller-layer cycles; happy path precedes error path within the same layer; across items, preserve the order the user specified.
- **Trivially-green check**: every RED assertion must fail against current `src/`. Strengthen or remove cycles that would pass today.
- **Source field**: the `source` frontmatter field records where the cycle came from (checklist line, feature name, list item text). It is used for display and optional checklist tick-back — not required.
- Prefix numbering continues from the highest existing prefix in `cycles/`; start at `001` if absent.

## Steps

### 1. Parse input (NO STOP)
- [ ] Detect input type:
  - Checklist reference (e.g. `checklist:§3-4`) → read `<project>/docs/spec/checklist.md`, extract exact item text.
  - Doc/file reference → read the referenced file.
  - Inline text, single item → use verbatim.
  - Inline text, structured list → split into discrete items; record each separately.
  - Feature plan (multi-sentence prose) → treat as one item; decomposition happens in Step 3.
- [ ] Record all resolved items as an ordered list. Each item becomes one planning unit.

### 2. Gather context (NO STOP)
- [ ] For each planning unit, scan `src/` for relevant files (service, controller, DTO, spec files).
- [ ] Read relevant files.
- [ ] Scan `cycles/` for existing files; record the highest NNN prefix found (or `000`).

### 3. Decompose each item into cycles (NO STOP)

For each planning unit:
- [ ] Apply atomic vs compound signals from Rules.
- [ ] If compound: split into ordered sub-cycles (service before controller; happy before error).
- [ ] If atomic: one cycle.
- [ ] Assign sequential NNN prefixes across all items (global counter, not per-item).
- [ ] For each cycle, draft full frontmatter + Behavior + RED + GREEN + REFACTOR using the format below.
- [ ] For each RED assertion, verify it would fail against current `src/`.
- [ ] If any assertion would pass today → strengthen it or remove the cycle. Do not draft a trivially-green cycle.

**Cycle file format:**
```md
---
id: cycle-NNN
slug: <kebab-slug>
status: pending
source: "<origin text — checklist line, feature name, or list item>"
covers: <happy-path | error-path | validation | atomic>
group: <shared-item-slug>   # same value for all cycles from one compound split; omit if atomic
---

## Behavior
<one paragraph — observable change this cycle produces>

## RED
- **Test file**: `<path>.spec.ts`
- **Assertion**:
  ```ts
  // exact test code
  ```
- **Why it fails**: <one sentence — what is missing in src/>

## GREEN
- **Smallest change**: <prose description>
- **Files touched**: `<file>`

## REFACTOR
<specific opportunity, or "none">
```

### 4. Show chat summary and wait for approval (STOP — WAIT)

Print the following block, then stop:
```
Input: <summary of what was passed — one line>

Breakdown:
  cycle-NNN  <slug>  [RED: <one-line assertion>]  ← <source item>
  cycle-NNN  <slug>  [RED: <one-line assertion>]  ← <source item>
  ...

Split reasons: <one line per compound split, or "all atomic">
Total: N cycle(s) across M item(s)
```

Write files only after receiving explicit approval in Step 5.
If the user requests changes: revise the draft in memory, re-print the summary, and wait again.

### 5. Write approved cycle files (NO STOP)
- [ ] Create `<project>/cycles/` if it does not exist.
- [ ] Write each approved cycle file to `<project>/cycles/NNN-<kebab-slug>.md`.
- [ ] Confirm file paths written.
