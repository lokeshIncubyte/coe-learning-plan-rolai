# 03 — Interactive Learning (Quizzes + Flowcharts)

Reinforce the conceptual notes via in-chat quiz questions and ASCII flow diagrams. Output is dialogue, not files.

---

## When to run

After [`02-checklist-to-notes.md`](02-checklist-to-notes.md) has produced the notes, **before** the Build phase. Catches conceptual gaps cheaply (in a chat exchange) instead of expensively (during debug).

## Inputs

- All notes in `<project-path>/docs/notes/`
- (Optional) a specific note filename if you want to drill on one concept

## Outputs

- In-chat dialogue. No files written.

---

## Mode A — Quiz me

Ask the agent to test you on the notes. The agent generates a mix of question types, you answer, the agent grades and explains.

### Prompt

> Quiz me on the notes in `<project-path>/docs/notes/`. Read every note first.
>
> Generate a mix of question types — at least one of each:
> - **Multiple choice** (4 options, exactly one right) — tests recognition.
> - **True / false with reasoning** — I answer T/F and explain *why*; you grade the reasoning, not just the verdict.
> - **Predict the output** — given a small code/config snippet (5–15 lines), what does it produce / what error does it throw / what gets injected?
> - **"Explain in 2 sentences"** — pure recall + synthesis, no leading.
>
> Rules:
> - Ask **one question at a time**. Wait for my answer before showing the next.
> - After each answer: a one-line verdict (✅ correct / ❌ off / 🟡 partial), then a 2–4 line explanation pointing at the specific note that covers it (e.g., *"see `03-dependency-injection.md` — `design:paramtypes` paragraph"*).
> - Don't gild correct answers. If I nail it, just confirm and move on.
> - Calibrate difficulty: if I answer the first three correctly, escalate; if I miss two in a row, drop down and re-test the underlying primitive.
> - After ~8 questions or when I say *stop*, give me a short scoresheet: *Strong: …, Weak: …, Re-read: <list of note files>*.
>
> Do not write any files. This is chat-only.

### Variants

- **Drill one concept**: *"Quiz me on `03-dependency-injection.md` only — 5 questions, all about `design:paramtypes` and provider scope."*
- **Open-book**: *"I'll be looking at the notes while answering. Make the questions harder — ones where the note doesn't directly state the answer."*
- **Mock interview**: *"Pretend you're an interviewer. Three open-ended questions about NestJS modules, follow-ups based on my answers."*

---

## Mode B — Draw the flow

Ask the agent to render the concept as ASCII flow charts in chat. Useful when the note is abstract and you want to see the runtime sequence.

### Prompt

> Draw ASCII flow charts in chat for the key dynamic flows described in `<project-path>/docs/notes/`. Read the notes first.
>
> For each flow:
> - One self-contained code block with the diagram. Vertical layout (`↓`), boxes with `[…]` for things, *italics* in side-comments for triggers.
> - **Caption beneath** — 2–4 lines explaining what triggers the flow, what passes between steps, and what the user/client observes at the end.
>
> Cover at minimum (skip any that don't apply to this project):
> 1. **App startup / DI wiring** — how the framework constructs and wires components at boot.
> 2. **Single request lifecycle** — from incoming request to response, including any middleware/pipe/guard layer.
> 3. **Validation / error path** — what happens when input fails validation; what shape the response takes.
> 4. **Side-effect flow** *(if relevant)* — DB write, external API call, queue publish, etc.
>
> Rules:
> - One flow per chat message. Wait for my reaction before drawing the next.
> - After each diagram, ask: *"Does the order match your mental model?"* — if I push back, redraw the disputed segment.
> - Don't write files. Diagrams stay in chat.

### Example flow shape

```
HTTP request
    ↓
[ Express adapter ]                       ← framework's HTTP layer
    ↓
[ Router → @Controller route match ]
    ↓
[ Global ValidationPipe @Body() ]         ← throws 400 here on bad input
    ↓
[ Controller method ]
    ↓
[ Service (DI'd via constructor) ]
    ↓
[ Response object → Express → wire ]
```

### Variants

- **Just one flow**: *"Only the validation error path — show me the exact JSON Nest returns when `@IsString` fails."*
- **Compare**: *"Draw the flow with `@Body()` validation, then redraw it without — what changes?"*

---

## Mode C — Both, freely interleaved

Modes A and B can be used **simultaneously or in any permutation of order** — there's no canonical sequence. Use whatever combination reinforces understanding fastest. Some shapes that work well:

### Suggested shape — "quiz first, draw on miss"

> Quiz me on `<project-path>/docs/notes/`. After any wrong or partial answer, **draw the relevant flow as a flowchart** before moving on — that's usually faster than explaining the same thing in prose. Switch back to quizzing afterward.

### Suggested shape — "flowchart first, quiz on each"

> Walk me through the key runtime flows for this project as ASCII flowcharts. After each flowchart, ask one short prediction question that tests whether I can follow it. If I miss, redraw the disputed segment.

### Suggested shape — "free-form"

> Mix quiz questions and flowcharts however makes pedagogical sense. I'll redirect mid-session if I want to focus on one or the other. Don't enforce a sequence; respond to what I'm struggling with.

The two modes are **freely interleavable** — switching mid-session is normal, and the agent should follow the user's lead rather than impose a script.

---

## Verification

There's no file output to verify. The signal you're done is honest: when the agent stops surfacing concepts you struggle with, the notes have landed. If a particular note keeps coming up in the *Weak* list, re-read it before moving to scaffolding.

## Cross-links

- Previous: [`02-checklist-to-notes.md`](02-checklist-to-notes.md)
- Next: [`04-scaffold-project.md`](04-scaffold-project.md)
