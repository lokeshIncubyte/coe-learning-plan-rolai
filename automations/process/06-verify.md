# Phase 6 — Verify

[← Back to index](README.md) · Previous: [Phase 5 — Build](05-build.md) · Next: [Phase 7 — Ship](07-ship.md)

---

## Rules

- Verification is the dress rehearsal for Ship. Treat it as production-shaped.
- Run *all* the verification items from the checklist back-to-back, not just the last one.
- If anything fails, return to the relevant earlier phase — do not patch in Phase 6.

---

## Step 06 — Manual / scripted smoke test

### 06.1 Boot the project in dev mode

Same as [03.4](03-setup.md#34-agent-boots-the-dev-server-in-the-background) — background, poll for ready marker, do not sleep arbitrarily.

**NO STOP** — Agent-owned.

### 06.2 Walk through every Verify item in the checklist

For each item, run the verification (curl, test, manual click-through described in the checklist). Record the actual output next to the item.

Examples of typical Verify items:
- Initial `GET` returns the empty/default state.
- Valid `POST`/mutation creates and returns the new resource.
- Invalid input returns the framework's structured validation error (4xx).
- Subsequent reads reflect the prior write.

**NO STOP** — Read-only.

### 06.3 Stop the dev server

**NO STOP** — Agent-owned.

---

## When something fails here

A failure in Phase 6 is a signal that an earlier phase missed something. Return to that phase and fix it there — do not patch the failure inline. Common returns:

| Failure mode | Return to |
|---|---|
| Endpoint missing or wrong shape | [Phase 5 — Build](05-build.md) |
| Validation message ugly or missing | [Phase 5 — Build](05-build.md) (the validation sub-step) |
| Server won't boot | [Phase 4 — Diagnose](04-diagnose.md) |
| Spec was wrong all along | [Phase 1 — Plan](01-plan.md) — update the checklist first |

After the fix, re-run *all* Verify items from the top — no cherry-picking.

Next: [Phase 7 — Ship](07-ship.md)
