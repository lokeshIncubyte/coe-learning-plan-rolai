# 04 — Scaffold Project

Pre-flight environment check, tooling decisions, scaffold command, and dev-server verification.

---

## When to run

After Phase 2 (Learn) is complete. **Do not run earlier** — scaffolding without the conceptual grounding tends to produce code the user can't yet read.

Skip this automation entirely if the project is an extension of an existing scaffold (e.g., day-N+1 contributing to a project already scaffolded on day-3).

## Inputs

- A confirmed `checklist.md` whose *Setup* phase names the framework
- User decisions on three things (see Step 2 below)

## Outputs

- A scaffolded project at `<parent-folder>/<project-name>/`
- Verified default route / default test / default script returns the expected output
- Optional: project-level memory file recording any environment-specific quirks discovered

---

## Step 1 — Pre-flight

The agent runs read-only checks first and reports what it found:

```bash
node --version          # or rustc --version, python --version, etc.
<package-manager> --version
<framework-cli> --version   # may not be installed; that's expected
```

**NO STOP** — Read-only.

---

## Step 2 — Decide tooling (user input required)

Three decisions that **must** be settled before any side-effecting command:

| Decision | Common options | Notes |
|---|---|---|
| **CLI install style** | global install **vs.** one-shot via runner (`npx`, `pipx`, `cargo install`) | Prefer one-shot — no global state to clean up |
| **Project location** | subfolder of an existing repo **vs.** new standalone repo | If subfolder, pass the framework's `--skip-git` (or equivalent) so the scaffold doesn't create a nested `.git` |
| **Package manager** | `npm` / `yarn` / `pnpm` (or language equivalent) | Match what the rest of the repo uses |

**STOP — WAIT** for the user to answer all three.

---

## Step 3 — Run the scaffold

### Prompt

> Pre-flight: run `node --version`, `<package-manager> --version`, and `<framework-cli> --version` (or equivalents for this language). Report results.
>
> Then ask me three yes/no questions and **STOP — WAIT**:
> 1. Use `<runner>` (one-shot) or install the CLI globally?
> 2. Project as a subfolder of this repo at `<parent-folder>/<project-name>/`, or a separate repo?
> 3. Package manager: `<options>`?
>
> Once I answer, run the scaffold:
> ```bash
> cd <parent-folder>
> <runner> <framework-cli> new <project-name> [--package-manager <pm>] [--skip-git]
> ```
> Report any side effects worth knowing about (e.g., `--skip-git` may also skip `.gitignore` generation).

**STOP — WAIT** the first time on any new machine. Subsequent runs may be fully automated.

---

## Step 4 — Boot the dev server in the background

The agent runs the dev command with `run_in_background: true` and **polls the output log** for a "ready" signal — not a fixed `sleep`:

```bash
until grep -q "<ready-marker>\|Error\|EADDRINUSE" "$LOGFILE"; do sleep 2; done
```

Common ready markers:

| Framework | Marker |
|---|---|
| NestJS | `Nest application successfully started` |
| Vite | `Local:` |
| Next.js | `Ready in` |
| Rails | `Listening on` |
| Django runserver | `Starting development server at` |
| Generic Express | `listening on port` (depends on user code) |

**NO STOP** — Agent-owned.

---

## Step 5 — Verify the default response

```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:<port>/
```

For non-HTTP projects, swap the verification: run the default test, invoke the binary, etc.

**Expected:** known string from the scaffold's default route + `HTTP 200`.

**Anything else** → trigger Phase 4 (Diagnose) before continuing. Do not restart blindly. Investigate with OS-level introspection first:

```powershell
# Windows: find what's listening on the port
Get-NetTCPConnection -LocalPort <port> -State Listen |
  Select-Object LocalPort, OwningProcess
```
```bash
# macOS / Linux:
lsof -i :<port>
ss -lntp | grep ':<port>\b'
```

---

## Step 6 — Stop the dev server cleanly

Don't orphan the background process. The agent terminates it explicitly (e.g., `TaskStop <task-id>` in this harness).

**NO STOP** — Agent-owned.

---

## Step 7 — Save environment quirks (only if surprises were found)

If diagnosis surfaced something machine-specific (port collisions, locked tools, native deps that need rebuilding), the agent writes a memory file:

```
~/.claude/projects/<project>/memory/<topic>.md
```

Include `Why:` and `How to apply:` sections so future sessions on this machine don't re-discover the same surprise.

---

## Verification

After this automation:
1. The project exists at `<parent-folder>/<project-name>/`.
2. `<package-manager> run <dev-script>` boots cleanly and the default verification passes.
3. The *Setup* phase items in `checklist.md` are ticked.
4. If a `.gitignore` is missing (common with `--skip-git`), it's flagged in the agent's summary so it can be added before any commit.

### HUMAN TRIGGER — manual spot-check (UI projects only)

Before declaring Setup done on any project with a UI surface, the agent should invite the user to boot the project themselves and look at it in a browser. Reasoning: a 200-OK curl doesn't catch layout breakage, browser-console errors, or "the page renders but feels wrong." Skip this trigger for headless CLI / library projects.

## Cross-links

- Methodology context: [`process/03-setup.md`](process/03-setup.md) and [`process/04-diagnose.md`](process/04-diagnose.md)
- Previous: [`03-interactive-learning.md`](03-interactive-learning.md)
- Next: *(no automation yet for Build phase — see process doc)*
