---
name: verify-day
description: Run every Verify item in checklist.md as a smoke test; surface pass/fail.
---

# verify-day

## Inputs

- `<project>/docs/spec/checklist.md` — the *Verify* phase items

## Output

A pass/fail report for every Verify item. Either a green light to ship, or a routed bounce-back to an earlier phase.

## Rules

- Verification is the dress rehearsal for shipping. Treat it as production-shaped.
- Run **all** Verify items back-to-back. No cherry-picking.
- After any fix, re-run the **full** Verify list — never just the failed item.
- If anything fails, return to the relevant earlier phase. **Do not patch failures inline here.**

## Steps

1. Boot the dev server in the background (`run_in_background: true`, poll the output for the ready marker).
2. For each item under *Verify* in `checklist.md`:
   - Run the verification (curl, test command, manual click-through described in the item).
   - Record the **actual output** alongside the item in the agent's chat report.
   - Mark pass / fail.
3. Stop the dev server cleanly.

## Typical Verify items

- Initial `GET` returns the empty/default state.
- Valid `POST`/mutation creates and returns the new resource.
- Invalid input returns the framework's structured validation error (4xx).
- Subsequent reads reflect the prior write.

## Failure routing

| Failure mode | Return to |
|---|---|
| Endpoint missing or returns wrong shape | `/tdd-cycle` (the cycle that should have covered it) |
| Validation message is ugly or missing | `/tdd-cycle` (validation cycle) |
| Server won't boot | Diagnose: capture symptom precisely, OS-level introspection (`Get-NetTCPConnection`, `lsof`, `ps`), apply the smallest fix. **Don't restart blindly.** |
| Spec was wrong all along | `/plan-day` — update `checklist.md` first, then re-derive the cycle via `/tdd-plan` |

If anything fails, surface the failure mode and the recommended return phase. **Do not try to fix it here.**

## HITL checkpoint

**HUMAN TRIGGER — final acceptance** after all items pass. Present a summary table (item → actual output → pass/fail). The user approves before shipping; they may catch behaviors that pass technically but feel wrong.
