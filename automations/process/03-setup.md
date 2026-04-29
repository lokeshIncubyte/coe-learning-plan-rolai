# Phase 3 — Setup

[← Back to index](README.md) · Previous: [Phase 2 — Learn](02-learn.md) · Next: [Phase 4 — Diagnose](04-diagnose.md)

---

## Rules

- Pre-flight checks come first — never install or scaffold before knowing the environment can support it.
- Decisions that affect the user's machine globally (global package install, package manager choice, project location) require explicit approval before the agent acts.
- Agent runs the actual scaffold command once decisions are settled.
- A scaffolded project is not "done" until the dev server boots **and** the default verification (a route, a test, a script output) returns the expected response.

---

## Step 03 — Decide tooling, then scaffold

### 03.1 Pre-flight environment check

The agent runs and reports back (read-only):

```bash
node --version           # or rustc, python, etc.
<package-manager> --version
<framework-cli> --version  # may not be installed; that's fine
```

**NO STOP** — Read-only.

### 03.2 User decides tooling

Three decisions that *must* happen before any side-effecting command runs:

| Decision | Common options |
|---|---|
| CLI install style | global install **vs.** one-shot via runner (`npx`, `pipx`, `cargo install`, etc.) |
| Project location | subfolder of an existing repo **vs.** a new standalone repo |
| Package manager | npm / yarn / pnpm — or language equivalent |

**STOP — WAIT** — Three yes/no answers from the user.

### 03.3 Agent runs the scaffold

```bash
cd <day-or-parent-folder>
<runner> <framework-cli> new <project-name> [--package-manager <pm>] [--skip-git]
```

**Side effects to watch for:**
- A `--skip-git` flag (or equivalent) often *also* skips `.gitignore` generation. The project will need a `.gitignore` added before any commit (handled in Phase 7).
- Some scaffolders create nested `.git` directories when run inside an existing repo. Use the skip-git flag if the project is a subfolder.

**STOP — WAIT** the first time on any new machine. Once approved, may be re-run automatically.

### 03.4 Agent boots the dev server in the background

```
<package-manager> run start:dev   # or watch / dev / serve / run
```

The agent runs this with `run_in_background: true` and **polls the output log** for a "ready" signal rather than sleeping a fixed duration:

```bash
until grep -q "<ready-marker>\|Error\|EADDRINUSE" "$LOGFILE"; do sleep 2; done
```

The ready marker depends on the framework (`successfully started`, `Local:`, `Listening on`, `Compiled successfully`, etc.). Pick the one that prints once *and only* when the server is actually accepting requests.

**NO STOP** — Agent-owned. The agent stops the background process when verification is done (see 03.6).

### 03.5 Verify default response

```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:<port>/
```

Expected: a known string from the scaffold's default route, plus `HTTP 200`. Anything else triggers **[Phase 4 (Diagnose)](04-diagnose.md)** before continuing.

**NO STOP** — Pure verification.

### 03.6 Stop the dev server cleanly

The agent terminates the background process explicitly. Orphaned dev servers leak file watchers, ports, and CPU across sessions.

**NO STOP** — Agent-owned.

### 03.7 Optional — manual spot-check by the user

For projects with a UI or any user-facing surface, the agent's curl + status-code check doesn't catch everything (layout, console errors, request waterfall). The user is invited to:

1. Boot the dev server themselves: `<package-manager> run start:dev`
2. Open `http://localhost:<port>/` in a browser
3. Verify the default page renders, the browser console is clean, and nothing obvious looks wrong
4. Report back: *"all good"* or list anything that looks off

If the user reports an issue, jump to [Phase 4 — Diagnose](04-diagnose.md). Otherwise, proceed to Phase 5.

**HUMAN TRIGGER — boot it yourself and look at it.** Skip this trigger for headless CLI / library projects where there's nothing visual to verify.

---

## Runnable counterpart

The runnable automation for this phase is [`../04-scaffold-project.md`](../04-scaffold-project.md).

Next: [Phase 4 — Diagnose](04-diagnose.md) *(only if verification failed)* or [Phase 5 — Build](05-build.md)
