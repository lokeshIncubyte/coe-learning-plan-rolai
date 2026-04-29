# 02 — Checklist → Notes

For every item in the checklist's *Learn* phase, generate one focused conceptual note.

---

## When to run

Right after the checklist is confirmed, before any code is written. The notes are the conceptual foundation for the Build phase that follows.

## Inputs

- A confirmed `<project-path>/docs/spec/checklist.md` with a populated *Learn* phase
- Any reference material in `<project-path>/docs/references/` worth grounding the notes in

## Outputs

- `<project-path>/docs/notes/01-<concept>.md`
- `<project-path>/docs/notes/02-<concept>.md`
- … one file per Learn item, prefixed `01-`, `02-`, … in checklist order
- The *Learn* section of `checklist.md` updated to `- [x]` with relative links to each note

## Prompt (paste into a fresh agent session)

> Read `<project-path>/docs/spec/checklist.md`. For every item in the *Learn* phase, write one focused note at `<project-path>/docs/notes/<NN>-<kebab-case-topic>.md`. Number prefixes (`01-`, `02-`, …) follow the order the items appear in the checklist.
>
> Per-file constraints:
> - **One concept per file.** Do not bundle.
> - **Lead-in** — open with what the thing *is* in plain language. Avoid "X is a JavaScript framework that…"-style boilerplate.
> - **Why it matters** — a short section explaining what problem it solves or what becomes harder without it.
> - **Concrete shape** — show the actual API, syntax, or structure. Small code blocks > long prose.
> - **Tables** — use them whenever you'd otherwise write "compared to X, Y has more A and B and C".
> - **Key insight** — close with a single bolded sentence summarizing the takeaway. This is what the reader carries away.
> - **Length** — aim for ~70–150 lines per file. Tighter is better.
> - **No emojis** unless the concept itself requires one.
>
> When all notes are written, update the *Learn* section of `checklist.md`: each item becomes `- [x]` with a relative link to its note (e.g., `→ [`01-…`md`](../notes/01-…md)` if checklist lives in `docs/spec/`).
>
> If a Learn item is too vague to write a note from (e.g., "Learn the framework"), pick the most useful concrete narrowing and note your interpretation at the top of the file. Don't ask me to clarify — proceed and surface the choice.
>
> **Final step — HUMAN TRIGGER.** After the notes are written and the checklist is updated, list the new note files and ask me: *"Test understanding before scaffolding? Options: `quiz`, `quiz <note-file>`, `flowchart`, `mix` (freely interleave both), or `skip`. The two modes have no required order — switch between them mid-session as useful."* Wait for my answer; do **not** silently move on to scaffolding.

## Verification

After the agent finishes:
1. Open each note — does the *Key insight* at the bottom hold up? If you can't paraphrase it, the note isn't done.
2. Confirm every Learn checklist item is now `- [x]` with a working relative link.
3. Spot-check one note's tables/code blocks render correctly in your markdown renderer.

## Common adjustments

- **Want fewer, longer notes?** Group related Learn items in the prompt: "Items 3, 4, 5 all concern decorators — bundle them as `04-decorators.md`."
- **Want code anchors?** After Build phase, run the `/doc-concepts-map` skill (defined at [`.claude/skills/doc-concepts-map/SKILL.md`](../.claude/skills/doc-concepts-map/SKILL.md)) to produce a concepts-map doc that points each abstract note at concrete `src/` code.

## Cross-links

- Methodology context: [`process/02-learn.md`](process/02-learn.md) — Phase 2 (Learn)
- Optional reinforcement: [`03-interactive-learning.md`](03-interactive-learning.md)
- Next step: [`04-scaffold-project.md`](04-scaffold-project.md)
