---
name: quiz
description: In-chat quiz testing understanding of notes in docs/notes/.
---

# quiz

## Inputs

- Every file in `<project>/docs/notes/` (read all first)
- (Optional) a specific note filename for drill mode

## Output

In-chat dialogue. No files written.

## Steps

1. Read every note file under `<project>/docs/notes/`.
2. Ask **one question at a time**. Wait for the user's answer before showing the next.
3. Mix question types — at least one of each across the session:
   - **Multiple choice** (4 options, exactly one right)
   - **True/false with reasoning** (grade the reasoning, not just the verdict)
   - **Predict the output** (5–15 line code/config snippet)
   - **Explain in 2 sentences** (recall + synthesis)
4. After each answer:
   - One-line verdict: ✅ correct / ❌ off / 🟡 partial.
   - 2–4 line explanation pointing at the specific note that covers it.
   - Don't gild correct answers.
5. Calibrate difficulty:
   - 3 correct in a row → escalate.
   - 2 wrong in a row → drop down and re-test the underlying primitive.
6. After ~8 questions or when user says *stop*, print a scoresheet:
   - *Strong: …*
   - *Weak: …*
   - *Re-read: <list of note files>*

## Invocation variants

- `quiz <note-file>` — drill one note, 5 questions all about that file.
- `quiz open-book` — assume user is reading notes while answering; questions go harder than the notes directly state.
- `quiz interview` — three open-ended questions with follow-ups.

## Interleaving with flowcharts

The user may invoke `/flowchart` mid-session in either direction. Switch freely — no required sequence. The agent may also volunteer a quick ASCII diagram when a wrong answer suggests the user is missing the *shape* of a flow, then resume quizzing.

## HITL

The whole skill is HITL — every question is a HUMAN TRIGGER waiting on the user's answer.
