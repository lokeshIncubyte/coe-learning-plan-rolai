---
name: flowchart
description: Draw ASCII flow charts in chat for runtime sequences from docs/notes/.
---

# flowchart

## Inputs

- Every file in `<project>/docs/notes/` (read all first)

## Output

In-chat dialogue. No files written.

## Steps

1. Read every note file under `<project>/docs/notes/`.
2. Cover these flows at minimum (skip any that don't apply):
   - **App startup / DI wiring** — how the framework constructs and wires components at boot.
   - **Single request lifecycle** — incoming request → response, including middleware / pipe / guard layers.
   - **Validation / error path** — what happens when input fails; what shape the error response takes.
   - **Side-effect flow** *(if relevant)* — DB write, external API call, queue publish.
3. **One flow per chat message**, in a single fenced code block.
   - Vertical layout with `↓`.
   - Boxes use `[…]` for things.
   - Italics in side-comments for triggers.
4. Caption beneath each diagram (2–4 lines): what triggers the flow, what passes between steps, what the user/client observes at the end.
5. After each diagram, ask: *"Does the order match your mental model?"* If the user pushes back, redraw the disputed segment.

## Diagram shape — example

```
HTTP request
    ↓
[ Express adapter ]                  ← framework's HTTP layer
    ↓
[ Router → @Controller route match ]
    ↓
[ Global ValidationPipe @Body() ]    ← throws 400 here on bad input
    ↓
[ Controller method ]
    ↓
[ Service (DI'd via constructor) ]
    ↓
[ Response object → wire ]
```

## Invocation variants

- `flowchart <flow-name>` — draw only one specific flow.
- `flowchart compare X vs Y` — draw the same flow with and without a feature.

## Interleaving with quiz

The user may invoke `/quiz` mid-session in either direction. Switch freely. The agent may also volunteer one quick prediction question after drawing a flow (without entering full quiz mode).

## HITL

**HUMAN TRIGGER** after each flowchart: the user confirms or pushes back on the depiction.
