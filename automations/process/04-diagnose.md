# Phase 4 — Diagnose *(conditional)*

[← Back to index](README.md) · Previous: [Phase 3 — Setup](03-setup.md) · Next: [Phase 5 — Build](05-build.md)

---

## Rules

- Triggered only when a verification step (in Setup or Build) returns an unexpected result.
- "Restart" / "reinstall" is **never** the first response. Diagnose first.
- Use OS-level introspection (port listings, process tables, log inspection) before changing code.
- Once root cause is known, the fix should be the **smallest change** that addresses it, plus a memory note so the same surprise doesn't recur on later projects.

---

## Step 04 — Triage unexpected results

### 04.1 Capture the symptom precisely

Record what was expected and what actually happened. Frame as: *"`<verification command>` returned `<actual>`, expected `<expected>`."*

**NO STOP** — Read-only.

### 04.2 Inspect the system, not the code

Pick the right tool for the layer:

| Layer | Inspection tool (examples) |
|---|---|
| Network ports / listeners | `Get-NetTCPConnection` (Windows), `lsof -i`, `ss -lntp`, `netstat` |
| Processes | `ps`, `Get-Process`, Activity Monitor |
| Filesystem state | `find`, `Get-ChildItem`, `git status` |
| Build output | check `dist/`, `target/`, `.next/` — read what was actually produced |
| Logs | tail the dev server log; check system journals if relevant |

**Common surprise classes:**
- A port appears free to the new process but is silently shadowed by an OS-level forwarder (WSL relay, Docker, VPN).
- A "successful" install missed a native dependency that fails only at runtime.
- A scaffold flag silently skipped a generated file (e.g., `.gitignore`).
- A cached build artifact masked a source change.

**NO STOP** — Read-only.

### 04.3 Apply the smallest fix

Once root cause is identified, change one thing. Re-run the failed verification. Re-run *only* the failed verification — not the whole phase.

**STOP — WAIT** if the fix touches a config file, a port, or anything visible to other processes.

### 04.4 Save a memory if the surprise is environment-specific

If the cause was something about the user's machine that will surprise future-you (port collisions, locked-down tools, native deps that need rebuilding, PATH oddities), write a short memory file:

```
~/.claude/projects/<project>/memory/<topic>.md
```

Include `Why:` and `How to apply:` sections so future sessions can judge edge cases. Add a one-line pointer to `MEMORY.md` in the same folder.

**NO STOP** — Agent-owned.

---

## When to skip this phase

Diagnose is **conditional**. If every Setup verification passed cleanly, jump straight to [Phase 5 — Build](05-build.md). The phase exists for when reality disagrees with expectation — not as a checkpoint everyone has to pass.

Next: return to the phase whose verification failed (usually [Phase 3 — Setup](03-setup.md)) or proceed to [Phase 5 — Build](05-build.md) once the smallest fix has stuck.
