---
name: scaffold
description: Pre-flight, tooling decisions, scaffold a project, verify dev-server boot.
---

# scaffold

## Inputs

- `<project>/docs/spec/checklist.md` (the *Setup* phase names the framework)
- User decisions on three tooling choices

## Output

- Scaffolded project at `<parent-folder>/<project-name>/`
- Verified default route / default test returns the expected output
- *Setup* checklist items ticked
- (If `--skip-git` was used) flagged note that `.gitignore` is missing — add in `/ship-day`

## Steps

### 1. Pre-flight (read-only)

Run and report:
```bash
node --version
<package-manager> --version
<framework-cli> --version   # may not be installed; that's expected
```

### 2. Three tooling decisions — STOP — WAIT

Ask the user:
1. **CLI install style** — global install **vs.** one-shot via runner (`npx`, `pipx`, `cargo install`)? Prefer one-shot.
2. **Project location** — subfolder of this repo **vs.** new standalone repo? If subfolder, plan to use `--skip-git` to avoid nested `.git`.
3. **Package manager** — `npm` / `yarn` / `pnpm` (or language equivalent)?

Wait for all three answers.

### 3. Run the scaffold — STOP — WAIT first time

```bash
cd <parent-folder>
<runner> <framework-cli> new <project-name> [--package-manager <pm>] [--skip-git]
```

Note any side effects (e.g., `--skip-git` may also skip `.gitignore` generation).

### 4. Boot dev server in background — poll for ready

```bash
<package-manager> run start:dev   # run with run_in_background: true
```

Then poll the output log for a ready marker (framework-specific):

```bash
until grep -q "<ready-marker>\|Error\|EADDRINUSE" "$LOGFILE"; do sleep 2; done
```

Common ready markers: `Nest application successfully started`, `Local:` (Vite), `Ready in` (Next.js), `Listening on` (Rails), `Starting development server at` (Django).

### 5. Verify default response

```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:<port>/
```

Expected: known string from scaffold's default route + `HTTP 200`. **If anything else** → diagnose before continuing (do not restart blindly). Use OS introspection:

```powershell
Get-NetTCPConnection -LocalPort <port> -State Listen | Select-Object LocalPort, OwningProcess
```
```bash
lsof -i :<port>
```

Common surprise: WSL relay / Docker / VPN silently shadowing the port.

### 6. Stop dev server cleanly

Terminate the background task. Don't orphan watchers / ports / CPU across sessions.

### 7. Manual spot-check — HUMAN TRIGGER (UI projects only)

For projects with a UI surface, invite the user to boot the dev server themselves and open the default route in a browser. Look for layout breaks, console errors, "feels wrong." Skip for headless CLI / library projects.

## Saving environment quirks

If a surprise was diagnosed (port collision, locked tool, native dep that needs rebuilding), write a memory file at `~/.claude/projects/<project>/memory/<topic>.md` with `Why:` and `How to apply:` so future sessions don't re-discover.
