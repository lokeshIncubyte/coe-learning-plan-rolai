# Picsum Lab — TDD Execution Steps

One behavior per cycle, one commit per RED/GREEN/REFACTOR step. Mark each step ✅ when done.

The build ran in two phases. Phase 1 stood the app up from an empty Vite template through a final integration verification; Phase 2 fixed bugs surfaced during a manual walkthrough and added UX polish. Each phase had its own rules for when the agent could run commands autonomously vs. stop for human input.

---

## Phase 1 — initial build (Steps 00–12)

**Rules (Phase 1)**
- Agent writes all code — no stops for coding steps.
- Stop for: commands, PR actions, human approval.
- For any command step, provide commands in chat first and wait for explicit approval before executing.
- `main` must always stay green.
- Merge after every completed cycle.

---

## Step 00 — Project setup and test runner

**Goal**
Scaffold the React + TypeScript app and confirm tests can run.

---

### 00.1 Scaffold the app

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm create vite@latest picsum-lab -- --template react-ts
   cd picsum-lab
   npm install
   ```

**STOP — WAIT**
Command step. Wait for console output confirming installation completes without errors.

- [x] 00.1 App scaffold ✅

---

### 00.2 Install test dependencies

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```

**STOP — WAIT**
Command step. Wait for install output with no errors.

- [x] 00.2 Test dependencies installed ✅

---

### 00.3 Agent configures test setup

**Agent prompt**
Configure Vitest for a React + TypeScript project. Update `vite.config.ts` to add a `test` block with `environment: 'jsdom'` and reference a setup file. Create `src/test/setup.ts` that imports `@testing-library/jest-dom`. Update `tsconfig.json` to include the setup file. Follow the folder layout in the architecture doc so paths are consistent with the rest of the project structure.

**Reference docs**
- [`architecture.md`](./architecture.md) — folder structure section; ensure `src/test/` placement matches the overall layout.

**NO STOP** — Agent-owned. Continues automatically.

- [x] 00.3 Test config written ✅

---

### 00.4 Confirm test runner works

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm test
   ```

**STOP — WAIT**
Command step. Wait for output confirming the test runner starts (0 tests passing is fine at this stage; no crash).

- [x] 00.4 Test runner confirmed ✅

---

## Step 01 — Cycle: App shell renders

**Goal**
App boots and renders Gallery, Controls, and Preview sections.

---

### 01.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/app-shell-renders
   ```

**STOP — WAIT**
Command step. Wait for branch creation confirmation.

- [x] 01.1 Branch created ✅

---

### 01.2 RED — Agent writes failing test

**Agent prompt**
Create `src/features/picsum-lab/components/PicsumLabPage.test.tsx`. Write one test that renders `PicsumLabPage` and asserts that three labelled regions are present in the DOM: Gallery, Controls, and Preview. The test should fail because the component does not exist yet. Use the component responsibilities table in the architecture doc to understand what `PicsumLabPage` owns. Use user story A (first open) from the user stories doc to understand what the initial rendered state should look like.

**Reference docs**
- [`architecture.md`](./architecture.md) — component responsibilities table; `PicsumLabPage` composes gallery, preview, controls.
- [`user-stories.md`](./user-stories.md) — Story A (first open); user sees the three sections on load.

**NO STOP** — Agent-owned. Continues automatically.

- [x] 01.2 RED test written ✅

---

### 01.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm test
   ```

**STOP — WAIT**
Command step. Wait for output showing new test fails as expected.

- [x] 01.3 RED confirmed ✅

---

### 01.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: app shell renders gallery, controls and preview sections"
   ```

**STOP — WAIT**
Command step. Wait for commit hash output.

- [x] 01.4 RED committed ✅

---

### 01.5 GREEN — Agent creates shell component

**Agent prompt**
Create `src/app/App.tsx` and `src/features/picsum-lab/components/PicsumLabPage.tsx`. `PicsumLabPage` should render three clearly labelled sections: Gallery, Controls, and Preview. Use only the minimum markup needed to pass the test. Follow the folder structure exactly as specified in the architecture doc. Do not add any logic or state at this stage.

**Reference docs**
- [`architecture.md`](./architecture.md) — folder structure (`src/app/`, `src/features/picsum-lab/components/`); component responsibilities for `PicsumLabPage`.

**NO STOP** — Agent-owned. Continues automatically.

- [x] 01.5 GREEN code written ✅

---

### 01.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm test
   ```

**STOP — WAIT**
Command step. Wait for all tests passing.

- [x] 01.6 GREEN confirmed ✅

---

### 01.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: app shell renders gallery, controls and preview sections"
   ```

**STOP — WAIT**
Command step. Wait for commit hash.

- [x] 01.7 GREEN committed ✅

---

### 01.8 REFACTOR — Agent cleans up

**Agent prompt**
Review `App.tsx` and `PicsumLabPage.tsx` for any naming, structure, or import inconsistencies. Ensure file and folder names match exactly the structure in the architecture doc. Do not change rendered output or behavior.

**Reference docs**
- [`architecture.md`](./architecture.md) — folder structure and component responsibilities.

**NO STOP** — Agent-owned. Continues automatically.

- [x] 01.8 REFACTOR written ✅

---

### 01.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm test
   ```

**STOP — WAIT**
Command step. Wait for all tests passing.

- [x] 01.9 REFACTOR confirmed ✅

---

### 01.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: clean up app shell structure"
   ```

**STOP — WAIT**
Command step. Wait for commit hash.

- [x] 01.10 REFACTOR committed ✅

---

### 01.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git push -u origin tdd/app-shell-renders
   ```
2. Open PR to `main` on GitHub.
3. Squash and merge with message:
   ```
   feat: render app shell with gallery, controls and preview sections
   ```

**STOP — WAIT**
Human action + command. Wait for push confirmation then PR merge confirmation.

- [x] 01.11 Merged to `main` ✅

---

### 01.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/app-shell-renders
   git push origin --delete tdd/app-shell-renders
   git log --oneline -n 5
   ```

**STOP — WAIT**
Command step. Wait for log output showing squash commit on `main`.

- [x] 01.12 Cleanup and log captured ✅

---

## Step 02 — Cycle: Gallery fetch loading state

**Goal**
Gallery shows loading state while the request is in flight.

---

### 02.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/gallery-fetch-loading-state
   ```

**STOP — WAIT**
Command step. Wait for branch confirmation.

- [x] 02.1 Branch created ✅

---

### 02.2 RED — Agent writes failing test

**Agent prompt**
Create `src/features/picsum-lab/hooks/usePicsumGallery.test.ts`. Write one test that calls `usePicsumGallery` while a fetch is still pending and asserts the returned state has `status: 'loading'`. Mock `fetch` so it never resolves during this test. The hook does not exist yet so the test should fail. Base the expected `GalleryFetchState` shape on the UI state schema in the app schema doc.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `GalleryFetchState` discriminated union; `{ status: 'loading' }` variant.
- [`user-stories.md`](./user-stories.md) — Story A step 2: gallery shows loading state.

**NO STOP** — Agent-owned. Continues automatically.

- [x] 02.2 RED test written ✅

---

### 02.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm test
   ```

**STOP — WAIT**
Command step. Wait for expected failure output.

- [x] 02.3 RED confirmed ✅

---

### 02.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: show loading state while gallery request is in flight"
   ```

**STOP — WAIT**
Command step. Wait for commit hash.

- [x] 02.4 RED committed ✅

---

### 02.5 GREEN — Agent implements hook and fetch helper

**Agent prompt**
Create `src/features/picsum-lab/hooks/usePicsumGallery.ts` and `src/features/picsum-lab/lib/fetchJson.ts`. The hook should initialise state as `{ status: 'loading' }` before making any request. `fetchJson` should accept a URL and a type validator. Use the data flow diagram in the architecture doc to understand how the hook calls fetchJson. The `GalleryFetchState` type must match the schema exactly. Do not implement success or error transitions yet — only loading is needed to pass the current red test.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `GalleryFetchState` union; cross-cutting notes on `fetchJson(url, validator)` pattern.
- [`architecture.md`](./architecture.md) — data flow: mount → usePicsumGallery → fetchJson; layers rule (no fetch in components).

**NO STOP** — Agent-owned. Continues automatically.

- [x] 02.5 GREEN code written ✅

---

### 02.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm test
   ```

**STOP — WAIT**
Command step. Wait for all tests passing.

- [x] 02.6 GREEN confirmed ✅

---

### 02.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: set gallery status to loading before request resolves"
   ```

**STOP — WAIT**
Command step. Wait for commit hash.

- [x] 02.7 GREEN committed ✅

---

### 02.8 REFACTOR — Agent cleans up

**Agent prompt**
Review `usePicsumGallery.ts` and `fetchJson.ts`. Ensure they sit in the correct folders per the architecture doc. Check that `GalleryFetchState` is imported from `types.ts` rather than defined inline. No behavior changes.

**Reference docs**
- [`architecture.md`](./architecture.md) — folder structure (`hooks/`, `lib/`); layers rule.

**NO STOP** — Agent-owned. Continues automatically.

- [x] 02.8 REFACTOR written ✅

---

### 02.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm test
   ```

**STOP — WAIT**
Command step. Wait for all tests passing.

- [x] 02.9 REFACTOR confirmed ✅

---

### 02.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: simplify gallery fetch status transitions"
   ```

**STOP — WAIT**
Command step. Wait for commit hash.

- [x] 02.10 REFACTOR committed ✅

---

### 02.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git push -u origin tdd/gallery-fetch-loading-state
   ```
2. Open PR to `main`. Squash and merge with:
   ```
   feat: display loading state during gallery fetch
   ```

**STOP — WAIT**
Human action + command. Wait for merge confirmation.

- [ ] 02.11 Merged to `main` ✅

---

### 02.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/gallery-fetch-loading-state
   git push origin --delete tdd/gallery-fetch-loading-state
   git log --oneline -n 5
   ```

**STOP — WAIT**
Command step. Wait for log output.

- [ ] 02.12 Cleanup done ✅

---

## Step 03 — Cycle: Gallery fetch success

**Goal**
Gallery shows list of photos after successful fetch.

---

### 03.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/gallery-fetch-success
   ```

**STOP — WAIT**

- [ ] 03.1 Branch created ✅

---

### 03.2 RED — Agent writes failing test

**Agent prompt**
Add a new test to `usePicsumGallery.test.ts`. Mock `fetch` to return a valid JSON response matching the exact shape of the Picsum list API. After the hook resolves, assert that state is `{ status: 'success', photos: [...] }` with the correct photo array. Base the mock response shape on the verified JSON in the remote schema doc. The test should fail because the success transition is not implemented.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — `GET /v2/list` element shape; example JSON; `PicsumPhoto` type.
- [`schema-app.md`](./schema-app.md) — `GalleryFetchState` `success` variant with `photos: PicsumPhoto[]`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 03.2 RED test written ✅

---

### 03.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**
Wait for expected failure.

- [ ] 03.3 RED confirmed ✅

---

### 03.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: set gallery status to success with photos on valid response"
   ```

**STOP — WAIT**

- [ ] 03.4 RED committed ✅

---

### 03.5 GREEN — Agent implements success path

**Agent prompt**
Create `src/features/picsum-lab/model/types.ts` with `PicsumPhoto`, `PicsumListResponse`, and `GalleryFetchState` exactly as specified in the schema docs. Create `src/features/picsum-lab/model/guards.ts` with `isPicsumPhoto` and `isPicsumListPayload`. `isPicsumPhoto` must check: value is a non-null object; `'id' in value`; `typeof value.id === 'string'`; repeat for all six fields using `typeof` checks appropriate to each field's type. Update `usePicsumGallery.ts` to call `fetchJson` with `isPicsumListPayload` as the validator and transition to `success` state with the validated photos.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — exact `PicsumPhoto` field names, types, and notes (`id` is a string not a number; fields are snake_case).
- [`schema-app.md`](./schema-app.md) — `isPicsumPhoto` guard implementation note (object check → `in` → `typeof` per field); `isPicsumListPayload` uses `Array.isArray` + every element.
- [`architecture.md`](./architecture.md) — `model/` folder for types and guards; data flow for success path.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 03.5 GREEN code written ✅

---

### 03.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 03.6 GREEN confirmed ✅

---

### 03.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: set gallery status to success with validated photos array"
   ```

**STOP — WAIT**

- [ ] 03.7 GREEN committed ✅

---

### 03.8 REFACTOR — Agent cleans up

**Agent prompt**
Review `guards.ts` and `types.ts`. Ensure guard functions are composable (e.g. `isPicsumListPayload` calls `isPicsumPhoto` per element). Ensure `GalleryFetchState` is used from `types.ts` consistently across hook and tests. No behavior changes.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — guard table and implementation note.

**NO STOP** — Agent-owned. Continues automatically.

---

### 03.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 03.9 REFACTOR confirmed ✅

---

### 03.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: extract photo list parsing into guard helper"
   ```

**STOP — WAIT**

- [ ] 03.10 REFACTOR committed ✅

---

### 03.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/gallery-fetch-success`
2. Open PR. Squash and merge:
   ```
   feat: populate gallery with validated photo list on success
   ```

**STOP — WAIT**

- [ ] 03.11 Merged to `main` ✅

---

### 03.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/gallery-fetch-success
   git push origin --delete tdd/gallery-fetch-success
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 03.12 Cleanup done ✅

---

## Step 04 — Cycle: Gallery fetch error state

**Goal**
Gallery shows error message when fetch fails or payload is invalid.

---

### 04.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/gallery-fetch-error
   ```

**STOP — WAIT**

- [ ] 04.1 Branch created ✅

---

### 04.2 RED — Agent writes failing tests

**Agent prompt**
Add two tests to `usePicsumGallery.test.ts`. First: mock `fetch` to reject (network failure) and assert state becomes `{ status: 'error', message: <string> }`. Second: mock `fetch` to resolve with a body that does not match `PicsumPhoto` shape and assert state also becomes the `error` variant. Both should fail because the error path is not implemented. Reference the error variant of `GalleryFetchState` and user story E for the expected UI behavior.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `GalleryFetchState` `error` variant: `{ status: 'error'; message: string }`.
- [`user-stories.md`](./user-stories.md) — Story E: network failure → error state → UI shows failure.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 04.2 RED tests written ✅

---

### 04.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 04.3 RED confirmed ✅

---

### 04.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: set gallery status to error on network failure or invalid payload"
   ```

**STOP — WAIT**

- [ ] 04.4 RED committed ✅

---

### 04.5 GREEN — Agent implements error path

**Agent prompt**
Update `usePicsumGallery.ts` to wrap the fetch + parse in a `try/catch`. On any thrown error, set state to `{ status: 'error', message: <error message string> }`. When `fetchJson` returns `null` (guard rejection), also transition to error state. The error message should be a plain string. Follow the data flow in the architecture doc.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `GalleryFetchState` error variant; cross-cutting note: "wraps fetch/parse in try/catch and maps failures into error variant".
- [`architecture.md`](./architecture.md) — data flow: fetch list → parse as unknown → update GalleryFetchState (success | error).

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 04.5 GREEN code written ✅

---

### 04.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 04.6 GREEN confirmed ✅

---

### 04.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: transition gallery to error state on fetch failure or bad payload"
   ```

**STOP — WAIT**

- [ ] 04.7 GREEN committed ✅

---

### 04.8 REFACTOR — Agent cleans up

**Agent prompt**
Review the error handling in `usePicsumGallery.ts` and `fetchJson.ts`. Ensure the two failure paths (network error and guard failure) produce the same `error` state shape without duplicated logic. Extract a shared mapping helper if it reduces duplication. No behavior changes.

**Reference docs**
- [`architecture.md`](./architecture.md) — layers rule: infrastructure handles raw fetch; hook handles state transitions.

**NO STOP** — Agent-owned. Continues automatically.

---

### 04.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 04.9 REFACTOR confirmed ✅

---

### 04.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: unify error mapping across fetch and parse failures"
   ```

**STOP — WAIT**

- [ ] 04.10 REFACTOR committed ✅

---

### 04.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/gallery-fetch-error`
2. Squash and merge:
   ```
   feat: handle gallery fetch errors from network and invalid payload
   ```

**STOP — WAIT**

- [ ] 04.11 Merged to `main` ✅

---

### 04.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/gallery-fetch-error
   git push origin --delete tdd/gallery-fetch-error
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 04.12 Cleanup done ✅

---

## Step 05 — Cycle: Gallery rows and selection

**Goal**
Gallery renders rows; clicking a row marks it selected.

---

### 05.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/gallery-rows-selection
   ```

**STOP — WAIT**

- [ ] 05.1 Branch created ✅

---

### 05.2 RED — Agent writes failing tests

**Agent prompt**
Create `src/features/picsum-lab/components/Gallery.test.tsx` and `src/features/picsum-lab/components/GalleryRow.test.tsx`. In `Gallery.test.tsx`: render `Gallery` with a mock photos array and assert each row displays the photo's `id` and `author`. In `GalleryRow.test.tsx`: render a single `GalleryRow` and assert clicking it calls the `onSelectPhoto` callback with the correct photo object. Use only `id` and `author` fields from the photo — see the remote schema doc for field names. Neither component exists yet so both tests should fail.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — `PicsumPhoto` field names (`id`, `author`); these are the fields to display per row.
- [`schema-app.md`](./schema-app.md) — `Pick<PicsumPhoto, 'id' | 'author' | 'download_url'>` pattern for row props.
- [`architecture.md`](./architecture.md) — `Gallery` receives `photos`, `selectedPhotoId`, `onSelectPhoto`; `GalleryRow` receives `onSelectPhoto` prop-drilled from `Gallery`.
- [`user-stories.md`](./user-stories.md) — Story B step 1: user activates a gallery row.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 05.2 RED tests written ✅

---

### 05.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 05.3 RED confirmed ✅

---

### 05.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: gallery renders rows and calls onSelectPhoto on click"
   ```

**STOP — WAIT**

- [ ] 05.4 RED committed ✅

---

### 05.5 GREEN — Agent creates components

**Agent prompt**
Create `src/features/picsum-lab/components/Gallery.tsx` and `src/features/picsum-lab/components/GalleryRow.tsx`. `Gallery` accepts `photos: PicsumPhoto[]`, `selectedPhotoId: string | null`, and `onSelectPhoto: (photo: PicsumPhoto) => void`. It renders a list and passes `onSelectPhoto` down to each `GalleryRow` (prop drilling as described in the architecture doc). `GalleryRow` displays `id` and `author` and calls `onSelectPhoto` on click. Use `Pick<PicsumPhoto, 'id' | 'author' | 'download_url'>` or a similar derived type for the row props.

**Reference docs**
- [`architecture.md`](./architecture.md) — `Gallery` and `GalleryRow` component responsibilities; prop drilling note.
- [`schema-remote.md`](./schema-remote.md) — `PicsumPhoto` type definition.
- [`schema-app.md`](./schema-app.md) — derived props pattern using `Pick`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 05.5 GREEN code written ✅

---

### 05.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 05.6 GREEN confirmed ✅

---

### 05.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: render gallery rows and emit selection callback"
   ```

**STOP — WAIT**

- [ ] 05.7 GREEN committed ✅

---

### 05.8 REFACTOR — Agent cleans up

**Agent prompt**
Review `Gallery.tsx` and `GalleryRow.tsx`. Ensure prop types are derived from `PicsumPhoto` using utility types rather than duplicating field declarations. Ensure the prop-drilling pattern is clear and intentional per the architecture doc. No behavior changes.

**Reference docs**
- [`architecture.md`](./architecture.md) — component responsibilities and prop drilling note.
- [`schema-app.md`](./schema-app.md) — derived props with `Pick`.

**NO STOP** — Agent-owned. Continues automatically.

---

### 05.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 05.9 REFACTOR confirmed ✅

---

### 05.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: separate row selection prop drilling from Gallery state"
   ```

**STOP — WAIT**

- [ ] 05.10 REFACTOR committed ✅

---

### 05.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/gallery-rows-selection`
2. Squash and merge:
   ```
   feat: render selectable gallery rows with author and id
   ```

**STOP — WAIT**

- [ ] 05.11 Merged to `main` ✅

---

### 05.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/gallery-rows-selection
   git push origin --delete tdd/gallery-rows-selection
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 05.12 Cleanup done ✅

---

## Step 06 — Cycle: Preview URL builder (id source)

**Goal**
Selecting a row updates the preview image using a typed URL for that id.

---

### 06.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/preview-url-builder-id
   ```

**STOP — WAIT**

- [ ] 06.1 Branch created ✅

---

### 06.2 RED — Agent writes failing tests

**Agent prompt**
Create `src/features/picsum-lab/model/buildPicsumImageUrl.test.ts`. Write tests asserting that `buildPicsumImageUrl` with `source: { kind: 'id', id: '0' }`, `width: 400`, `height: 300`, and no effects returns the exact URL `https://picsum.photos/id/0/400/300`. Also create `src/features/picsum-lab/components/Preview.test.tsx` and write a test that renders `Preview` with a URL prop and asserts an `<img>` is rendered with that `src`. Neither file exists yet. Base the URL format on the image URL section of the remote schema doc.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — image URL section: `https://picsum.photos/id/{id}/{width}/{height}` pattern.
- [`schema-app.md`](./schema-app.md) — `ImageSource` discriminated union (`kind: 'id'`); `BuildImageUrlInput` type.
- [`architecture.md`](./architecture.md) — `Preview` component: `<img src={url} />` where url comes from `buildPicsumImageUrl`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 06.2 RED tests written ✅

---

### 06.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 06.3 RED confirmed ✅

---

### 06.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: build preview URL from selected photo id with width and height"
   ```

**STOP — WAIT**

- [ ] 06.4 RED committed ✅

---

### 06.5 GREEN — Agent implements URL builder and Preview

**Agent prompt**
Create `src/features/picsum-lab/model/buildPicsumImageUrl.ts`. It accepts `BuildImageUrlInput` and returns a string URL. For `source.kind === 'id'`, the path must be `/id/{id}/{width}/{height}`. Use a `switch` on `source.kind` to narrow exhaustively (even if only `id` is tested now, the switch must handle all three variants to avoid implicit falls). Create `src/features/picsum-lab/components/Preview.tsx` that accepts a `url: string | null` prop and renders an `<img src={url}>` when a URL is present, or an empty/placeholder state otherwise.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — image URL patterns for id, seed, and random sources.
- [`schema-app.md`](./schema-app.md) — `ImageSource` union with all three `kind` variants; `BuildImageUrlInput` type; `ImageEffects` type.
- [`architecture.md`](./architecture.md) — `Preview` component responsibility; data flow: selection + dimensions → `buildPicsumImageUrl` → Preview updates src.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 06.5 GREEN code written ✅

---

### 06.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 06.6 GREEN confirmed ✅

---

### 06.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: build correct Picsum id URL and render in Preview"
   ```

**STOP — WAIT**

- [ ] 06.7 GREEN committed ✅

---

### 06.8 REFACTOR — Agent cleans up

**Agent prompt**
Review `buildPicsumImageUrl.ts`. Ensure the switch on `source.kind` is exhaustive and TypeScript would flag an unhandled variant at compile time. Ensure `BuildImageUrlInput` is imported from `types.ts` and not redefined. No behavior changes.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `ImageSource` union; `BuildImageUrlInput` type.

**NO STOP** — Agent-owned. Continues automatically.

---

### 06.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 06.9 REFACTOR confirmed ✅

---

### 06.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: simplify URL path composition in builder"
   ```

**STOP — WAIT**

- [ ] 06.10 REFACTOR committed ✅

---

### 06.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/preview-url-builder-id`
2. Squash and merge:
   ```
   feat: generate and display Picsum image URL from selected photo id
   ```

**STOP — WAIT**

- [ ] 06.11 Merged to `main` ✅

---

### 06.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/preview-url-builder-id
   git push origin --delete tdd/preview-url-builder-id
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 06.12 Cleanup done ✅

---

## Step 07 — Cycle: Size controls

**Goal**
Width and height inputs update the preview URL; invalid values are clamped/rejected.

---

### 07.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/size-controls
   ```

**STOP — WAIT**

- [ ] 07.1 Branch created ✅

---

### 07.2 RED — Agent writes failing tests

**Agent prompt**
Create or update `src/features/picsum-lab/components/Controls.test.tsx`. Write tests asserting: (1) when the user changes the width input, the `onWidthChange` callback is called with the new numeric value; (2) when the user changes the height input, `onHeightChange` is called; (3) entering a value of 0 or below either clamps to 1 or is rejected — document the expected behavior clearly in the test. The `Controls` component does not exist yet. Reference `BuildImageUrlInput` from the app schema for the expected width/height field types, and user story C for the expected flow.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `BuildImageUrlInput`: `width: number`, `height: number` fields.
- [`user-stories.md`](./user-stories.md) — Story C: user changes width/height → controls update shared state → `buildPicsumImageUrl` runs again.
- [`architecture.md`](./architecture.md) — `Controls` component: width, height, effects inputs; emits typed change callbacks.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 07.2 RED tests written ✅

---

### 07.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 07.3 RED confirmed ✅

---

### 07.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: width and height inputs update preview URL and reject invalid values"
   ```

**STOP — WAIT**

- [ ] 07.4 RED committed ✅

---

### 07.5 GREEN — Agent implements Controls with size inputs

**Agent prompt**
Create `src/features/picsum-lab/components/Controls.tsx`. Add a width input and a height input. Each emits a typed callback when changed. Clamp values to a minimum of 1 before calling the callback. Use `React.ChangeEvent<HTMLInputElement>` for input event types. Keep this component presentational — no internal state management beyond what the test requires.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `BuildImageUrlInput` for `width` and `height` types; React typing note.
- [`architecture.md`](./architecture.md) — `Controls` component responsibility: emits typed change callbacks.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 07.5 GREEN code written ✅

---

### 07.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 07.6 GREEN confirmed ✅

---

### 07.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: update preview URL from width and height with value clamping"
   ```

**STOP — WAIT**

- [ ] 07.7 GREEN committed ✅

---

### 07.8 REFACTOR — Agent cleans up

**Agent prompt**
Extract the dimension clamping logic into a small pure helper (e.g. `clampDimension`) so it is testable and not duplicated between width and height. No behavior changes.

**Reference docs**
- [`architecture.md`](./architecture.md) — layers: business logic should be testable outside components.

**NO STOP** — Agent-owned. Continues automatically.

---

### 07.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 07.9 REFACTOR confirmed ✅

---

### 07.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: centralise dimension validation logic"
   ```

**STOP — WAIT**

- [ ] 07.10 REFACTOR committed ✅

---

### 07.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/size-controls`
2. Squash and merge:
   ```
   feat: add width and height controls that update preview URL
   ```

**STOP — WAIT**

- [ ] 07.11 Merged to `main` ✅

---

### 07.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/size-controls
   git push origin --delete tdd/size-controls
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 07.12 Cleanup done ✅

---

## Step 08 — Cycle: Effects controls (grayscale and blur)

**Goal**
Grayscale and blur toggles correctly append/remove query params in the URL.

---

### 08.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/effects-controls
   ```

**STOP — WAIT**

- [ ] 08.1 Branch created ✅

---

### 08.2 RED — Agent writes failing tests

**Agent prompt**
Add tests to `buildPicsumImageUrl.test.ts` covering: (1) `effects.grayscale = true` appends `?grayscale` to the URL; (2) `effects.blur = true` with no `blurAmount` appends `?blur`; (3) `effects.blur = true` with `blurAmount: 5` appends `?blur=5`; (4) both effects off produce no query string. Also add tests to `Controls.test.tsx` asserting the grayscale checkbox and blur toggle call their respective callbacks with the new boolean value. Reference the exact query param names from the remote schema doc and the `ImageEffects` type from the app schema doc.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — query parameters section: `?grayscale`, `?blur`, `?blur=1..10`.
- [`schema-app.md`](./schema-app.md) — `ImageEffects` type: `grayscale: boolean`, `blur: boolean`, `blurAmount?: 1..10`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 08.2 RED tests written ✅

---

### 08.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 08.3 RED confirmed ✅

---

### 08.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: grayscale and blur params append and remove correctly in URL"
   ```

**STOP — WAIT**

- [ ] 08.4 RED committed ✅

---

### 08.5 GREEN — Agent implements effects

**Agent prompt**
Update `buildPicsumImageUrl.ts` to build a query string from `effects`: append `grayscale` when `effects.grayscale` is true; append `blur` or `blur={n}` when `effects.blur` is true (use `blurAmount` if provided). Update `Controls.tsx` to add a grayscale checkbox and a blur toggle (with optional blur level input) that emit typed callbacks. Use the `ImageEffects` type from `types.ts`.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — exact query param names and combination rules.
- [`schema-app.md`](./schema-app.md) — `ImageEffects` type; `blurAmount` is `1..10` union (not a free number).

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 08.5 GREEN code written ✅

---

### 08.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 08.6 GREEN confirmed ✅

---

### 08.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: append grayscale and blur query params based on effect state"
   ```

**STOP — WAIT**

- [ ] 08.7 GREEN committed ✅

---

### 08.8 REFACTOR — Agent cleans up

**Agent prompt**
Extract the query string building logic into a dedicated pure helper (e.g. `buildQueryString(effects, nonce?)`) separate from the path-building logic in `buildPicsumImageUrl`. This makes each concern independently testable. No behavior changes.

**Reference docs**
- [`architecture.md`](./architecture.md) — layers: domain helpers should be pure and testable.

**NO STOP** — Agent-owned. Continues automatically.

---

### 08.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 08.9 REFACTOR confirmed ✅

---

### 08.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: extract query param builder from URL composer"
   ```

**STOP — WAIT**

- [ ] 08.10 REFACTOR committed ✅

---

### 08.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/effects-controls`
2. Squash and merge:
   ```
   feat: add grayscale and blur effect controls with correct query params
   ```

**STOP — WAIT**

- [ ] 08.11 Merged to `main` ✅

---

### 08.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/effects-controls
   git push origin --delete tdd/effects-controls
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 08.12 Cleanup done ✅

---

## Step 09 — Cycle: Random cache-bust

**Goal**
A refresh action appends `?random={n}` to force the image to reload.

---

### 09.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/random-cache-bust
   ```

**STOP — WAIT**

- [ ] 09.1 Branch created ✅

---

### 09.2 RED — Agent writes failing test

**Agent prompt**
Add a test to `buildPicsumImageUrl.test.ts` asserting that when `randomNonce: 42` is passed in the input, the resulting URL contains `random=42` in the query string. Add a second test asserting that when `randomNonce` is absent, `random` does not appear. Neither case is handled yet. Reference the `BuildImageUrlInput` type and the `?random={n}` pattern from the remote schema doc.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — query parameters section: `?random={n}` to reduce caching.
- [`schema-app.md`](./schema-app.md) — `BuildImageUrlInput`: `randomNonce?: number` field.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 09.2 RED test written ✅

---

### 09.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 09.3 RED confirmed ✅

---

### 09.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: random nonce appended to URL for cache-busting"
   ```

**STOP — WAIT**

- [ ] 09.4 RED committed ✅

---

### 09.5 GREEN — Agent implements nonce logic

**Agent prompt**
Update the query string builder (from step 08 refactor) to include `random={randomNonce}` when `randomNonce` is provided and greater than 0. Update `Controls.tsx` or a parent component to add a refresh button that increments the nonce value and passes it down. The nonce generation should be a simple counter increment or `Date.now()` — document which approach is used.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — `?random={n}` usage note.
- [`schema-app.md`](./schema-app.md) — `BuildImageUrlInput.randomNonce?: number`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 09.5 GREEN code written ✅

---

### 09.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 09.6 GREEN confirmed ✅

---

### 09.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: append random nonce to URL to bust image cache on refresh"
   ```

**STOP — WAIT**

- [ ] 09.7 GREEN committed ✅

---

### 09.8 REFACTOR — Agent cleans up

**Agent prompt**
If nonce generation logic is inline, extract it to a named helper for clarity. Ensure the refresh button and nonce state sit in a component layer consistent with the architecture doc. No behavior changes.

**Reference docs**
- [`architecture.md`](./architecture.md) — layers; domain helpers should be pure.

**NO STOP** — Agent-owned. Continues automatically.

---

### 09.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 09.9 REFACTOR confirmed ✅

---

### 09.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: move nonce generation to dedicated helper"
   ```

**STOP — WAIT**

- [ ] 09.10 REFACTOR committed ✅

---

### 09.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/random-cache-bust`
2. Squash and merge:
   ```
   feat: add random nonce to image URL for cache-busting on refresh
   ```

**STOP — WAIT**

- [ ] 09.11 Merged to `main` ✅

---

### 09.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/random-cache-bust
   git push origin --delete tdd/random-cache-bust
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 09.12 Cleanup done ✅

---

## Step 10 — Cycle: Optional source variants (seed and random)

**Goal**
URL builder handles `seed` and `random` source kinds with correct path patterns.

---

### 10.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/source-variants
   ```

**STOP — WAIT**

- [ ] 10.1 Branch created ✅

---

### 10.2 RED — Agent writes failing tests

**Agent prompt**
Add tests to `buildPicsumImageUrl.test.ts` for the two remaining `ImageSource` variants: (1) `source: { kind: 'seed', seed: 'picsum' }` with `width: 400`, `height: 300` should return `https://picsum.photos/seed/picsum/400/300`; (2) `source: { kind: 'random' }` with the same dimensions should return `https://picsum.photos/400/300`. Both should fail because the switch in `buildPicsumImageUrl` does not handle these variants yet. Reference the exact URL patterns from the remote schema doc.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — image URL section: seed pattern `/seed/{seed}/{w}/{h}`; random pattern `/{w}/{h}`.
- [`schema-app.md`](./schema-app.md) — `ImageSource` union: all three `kind` variants.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 10.2 RED tests written ✅

---

### 10.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 10.3 RED confirmed ✅

---

### 10.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: URL builder handles seed and random source variants"
   ```

**STOP — WAIT**

- [ ] 10.4 RED committed ✅

---

### 10.5 GREEN — Agent implements source variant logic

**Agent prompt**
Update the `switch (source.kind)` in `buildPicsumImageUrl.ts` to handle all three cases: `'id'` → `/id/{id}/{w}/{h}`; `'seed'` → `/seed/{seed}/{w}/{h}`; `'random'` → `/{w}/{h}`. The switch must be exhaustive — add a `default` that TypeScript can use to catch unhandled variants at compile time.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — all three URL path patterns.
- [`schema-app.md`](./schema-app.md) — `ImageSource` discriminated union with `kind` as the discriminant.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 10.5 GREEN code written ✅

---

### 10.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 10.6 GREEN confirmed ✅

---

### 10.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: generate correct URL paths for seed and random source kinds"
   ```

**STOP — WAIT**

- [ ] 10.7 GREEN committed ✅

---

### 10.8 REFACTOR — Agent cleans up

**Agent prompt**
Verify the switch is fully exhaustive and TypeScript would report a type error if a new `kind` were added to `ImageSource` without updating the builder. Add an unreachable assertion if needed. No behavior changes.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `ImageSource` union; note on discriminated union narrowing.

**NO STOP** — Agent-owned. Continues automatically.

---

### 10.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 10.9 REFACTOR confirmed ✅

---

### 10.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: use exhaustive switch for source kind path building"
   ```

**STOP — WAIT**

- [ ] 10.10 REFACTOR committed ✅

---

### 10.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/source-variants`
2. Squash and merge:
   ```
   feat: support seed and random image source modes in URL builder
   ```

**STOP — WAIT**

- [ ] 10.11 Merged to `main` ✅

---

### 10.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/source-variants
   git push origin --delete tdd/source-variants
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 10.12 Cleanup done ✅

---

## Step 11 — Cycle: Optional localStorage persistence

**Goal**
User preferences are saved and restored across reload; corrupt data falls back safely.

---

### 11.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/localstorage-persistence
   ```

**STOP — WAIT**

- [ ] 11.1 Branch created ✅

---

### 11.2 RED — Agent writes failing tests

**Agent prompt**
Create `src/features/picsum-lab/hooks/useLocalStorageState.test.ts`. Write three tests: (1) when `localStorage` contains a valid `StoredPicsumLabPrefsV1` blob, the hook returns the stored `data` field; (2) when `localStorage` contains a corrupt JSON string, the hook returns the provided defaults without throwing; (3) when `localStorage` is empty, the hook returns the defaults. The hook does not exist yet. Use `StoredPicsumLabPrefsV1` from the app schema doc for the stored shape. Use user story D (reload with saved preferences) to understand expected fallback behavior.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `StoredPicsumLabPrefsV1` type; `isStoredPicsumLabPrefsV1` guard; cross-cutting note on persistence hook.
- [`user-stories.md`](./user-stories.md) — Story D: valid prefs hydrate; corrupt JSON falls back to defaults.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 11.2 RED tests written ✅

---

### 11.3 RED proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 11.3 RED confirmed ✅

---

### 11.4 RED commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "red: hydrate user prefs from localStorage and fall back on corrupt data"
   ```

**STOP — WAIT**

- [ ] 11.4 RED committed ✅

---

### 11.5 GREEN — Agent implements storage hook and guard

**Agent prompt**
Create `src/features/picsum-lab/hooks/useLocalStorageState.ts` as a generic hook `useLocalStorageState<T>(key, defaults, validate)`. It reads from `localStorage`, calls `JSON.parse` and treats the result as `unknown`, then passes it through the `validate` guard. If valid, returns `data`; otherwise returns `defaults`. Add `isStoredPicsumLabPrefsV1` to `guards.ts` following the same `typeof` + `in` pattern used for `isPicsumPhoto` — check `version === 1`, `typeof savedAt === 'string'`, and validate the nested `data` fields. The hook must accept any `T` with any validator, not just prefs.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `StoredPicsumLabPrefsV1` shape; `isStoredPicsumLabPrefsV1` in the guard table; cross-cutting note: "`useLocalStorageState<T>` reads/writes serialized values; on read, validate with a guard before state merge".
- [`architecture.md`](./architecture.md) — optional persistence data flow: mount → read → parse unknown → isStoredPicsumLabPrefsV1 → merge into state.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 11.5 GREEN code written ✅

---

### 11.6 GREEN proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 11.6 GREEN confirmed ✅

---

### 11.7 GREEN commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "green: restore valid prefs from localStorage with safe fallback on invalid data"
   ```

**STOP — WAIT**

- [ ] 11.7 GREEN committed ✅

---

### 11.8 REFACTOR — Agent cleans up

**Agent prompt**
Ensure the read and write concerns in `useLocalStorageState` are cleanly separated. The read path (parse → validate → merge) and write path (serialize → store) should be easy to follow independently. Move any JSON.parse/stringify helpers to `lib/` if they are not already there. No behavior changes.

**Reference docs**
- [`architecture.md`](./architecture.md) — `lib/` folder for infrastructure helpers; persistence data flow.

**NO STOP** — Agent-owned. Continues automatically.

---

### 11.9 REFACTOR proof run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `npm test`

**STOP — WAIT**

- [ ] 11.9 REFACTOR confirmed ✅

---

### 11.10 REFACTOR commit

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "refactor: separate storage read/write from hydration logic"
   ```

**STOP — WAIT**

- [ ] 11.10 REFACTOR committed ✅

---

### 11.11 PR + squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run: `git push -u origin tdd/localstorage-persistence`
2. Squash and merge:
   ```
   feat: persist and restore user preferences via localStorage with safe fallback
   ```

**STOP — WAIT**

- [ ] 11.11 Merged to `main` ✅

---

### 11.12 Post-merge cleanup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/localstorage-persistence
   git push origin --delete tdd/localstorage-persistence
   git log --oneline -n 5
   ```

**STOP — WAIT**

- [ ] 11.12 Cleanup done ✅

---

## Step 12 — Final integration verification

**Goal**
All flows work end to end. No open branches. `main` is fully green.

---

### 12.1 Branch setup

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/final-integration
   ```

**STOP — WAIT**

- [ ] 12.1 Branch created ✅

---

### 12.2 Agent adds missing integration tests

**Agent prompt**
Review all five user stories in `user-stories.md` and all flows in the architecture data flow section. For each story, confirm a test exists that covers the complete path from user action to visible result: (A) first open — loading then gallery list; (B) row selection — preview URL updates; (C) controls — URL reflects new dimensions and effects; (D) preferences — valid restore and corrupt fallback; (E) error — fetch failure shows error state. Add any missing tests at the integration level (rendering `PicsumLabPage` with mocked hooks or services). Do not duplicate existing unit tests.

**Reference docs**
- [`user-stories.md`](./user-stories.md) — all stories A through E with expected outcomes.
- [`architecture.md`](./architecture.md) — data flow for all three paths (gallery load, preview, persistence).
- [`schema-app.md`](./schema-app.md) — `GalleryFetchState` variants to assert against in integration tests.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 12.2 Integration tests written ✅

---

### 12.3 Full test + build + typecheck run

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   npm test
   npm run build
   npx tsc --noEmit
   ```

**STOP — WAIT**
Command step. Wait for all three to pass with no errors.

- [ ] 12.3 All checks green ✅

---

### 12.4 Commit and squash merge

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git add .
   git commit -m "test(integration): add end-to-end coverage for all Picsum Lab flows"
   git push -u origin tdd/final-integration
   ```
2. Open PR. Squash and merge:
   ```
   test: add integration coverage confirming all Picsum Lab flows
   ```

**STOP — WAIT**

- [ ] 12.4 Merged to `main` ✅

---

### 12.5 Post-merge cleanup and final log

1. Ask user in chat to run the following command(s). Do not run via agent.
2. Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/final-integration
   git push origin --delete tdd/final-integration
   git log --oneline -n 20
   ```

**STOP — WAIT**
Command step. Capture full log showing all squash commits on `main`.

- [ ] 12.5 Final log captured ✅

---

### 12.6 Manual walkthrough

Perform the following manually in the browser:

- [ ] App boots with no errors
- [ ] Gallery loads from Picsum API
- [ ] Selecting a row updates the preview
- [ ] Changing size updates the image
- [ ] Grayscale/blur toggles change the URL
- [ ] Refresh nonce changes the image
- [ ] Error state visible with network disabled
- [ ] (If implemented) preferences restore on reload

**STOP — WAIT**
Human action. Wait for confirmation all checks are ticked.

- [ ] 12.6 Manual walkthrough complete ✅

---



## Phase 2 — fixes and UX polish (Steps 13–22)

Phase 2 started after a manual walkthrough of the shipped Phase 1 app surfaced several bugs and missing behaviors (tracked in a now-deleted `ISSUES.md`). The rules loosened to let the agent run commands without asking — but in exchange added a hard stop after every GREEN commit for a user-driven browser check.

**Rules (Phase 2 — autonomous execution with manual-test gates)**
- Agent writes all code **and** runs all commands (git branch/commit/push, `npm test`, `npm run build`, `tsc`, cleanup). No per-command human stop.
- **After every GREEN commit, agent STOPS for manual browser testing.** User must verify the newly-green behavior in the running app before the agent proceeds to the next sub-step (next RED test or REFACTOR).
- Human approval is also required for the **PR + squash merge** step in each cycle and for the final manual browser walkthrough (Step 20.3). These keep explicit `**STOP — WAIT**` markers.
- `main` must always stay green.
- Merge after every completed cycle.
- RED must be atomic: one failing test per sub-step (`A`, `B`, ...), each with its own RED proof and RED commit before moving to GREEN for that sub-step.
- If a command fails, the agent fixes the root cause and re-runs, rather than pausing for the user.

**Phase 2 cycle map**

| Step | Issues addressed | Behavior |
|------|------------------|----------|
| 13 | #1, #2, #3 | Wire height + grayscale + blur state through `PicsumLabPage` |
| 15 | #6, #7 | Persist prefs back to localStorage; expand stored shape |
| 16 | #8, #10 | Render loading state; reconcile stale persisted selection |
| 17 | #4, #12 | Gallery as thumbnail grid; two-column layout (gallery left, preview right) |
| 18 | #11 | Blur amount control (1–10) |
| 19 | #9 | Default selection on first load |
| 21 | — | Gallery column scrolls independently (preview + controls stay pinned) |
| 22 | — | Bugfix: blur URL defaults to heavy while slider shows 1 (out-of-sync) |
| 20 | — | Final integration verification |

> Step 14 (Refresh / cache-bust) was removed — see chore/remove-random-refresh. Issue #5 is deleted.
> Step 21 was added after Step 19 — UX polish so only the gallery list scrolls on long lists.
> Step 22 was added after Step 21 — bugfix so the blur URL matches what the slider displays.

---

## Step 13 — Cycle: Wire height, grayscale, blur into page state

**Goal**
`PicsumLabPage` owns `height` and `effects` state, passes them plus change handlers to `Controls`, and feeds them into `buildPicsumImageUrl`. All three inputs become controlled and actually affect the preview.

---

### 13.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/wire-size-and-effects
   ```

- [ ] 13.1 Branch created ✅

---

### 13.2A RED — `Controls` renders height value from prop

**Agent prompt**
Add one test to `Controls.test.tsx`: when `Controls` is rendered with `height={512}`, the height input's `value` is `512`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.2A RED test written ✅

---

### 13.3A RED proof run

Run: `npm test`

- [ ] 13.3A RED confirmed ✅

---

### 13.4A RED commit

Run:
   ```
   git add .
   git commit -m "red: Controls renders height value from prop"
   ```

- [ ] 13.4A RED committed ✅

---

### 13.5A GREEN — pass `height` prop into height input

**Agent prompt**
Add an optional `height?: number` prop to `Controls`. Bind it to the height input's `value`. Do not change anything else.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `BuildImageUrlInput.height: number`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.5A GREEN code written ✅

---

### 13.6A GREEN proof run

Run: `npm test`

- [ ] 13.6A GREEN confirmed ✅

---

### 13.7A GREEN commit

Run:
   ```
   git add .
   git commit -m "green: Controls renders height value from prop"
   ```

- [ ] 13.7A GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 13.2B RED — `Controls` renders grayscale checked state from prop

**Agent prompt**
Add one test to `Controls.test.tsx`: when `Controls` is rendered with `grayscale={true}`, the grayscale checkbox is checked.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.2B RED test written ✅

---

### 13.3B RED proof run

Run: `npm test`

- [ ] 13.3B RED confirmed ✅

---

### 13.4B RED commit

Run:
   ```
   git add .
   git commit -m "red: Controls reflects grayscale prop on checkbox"
   ```

- [ ] 13.4B RED committed ✅

---

### 13.5B GREEN — pass `grayscale` prop to checkbox

**Agent prompt**
Add optional `grayscale?: boolean` prop to `Controls`. Bind it to the grayscale checkbox's `checked`. Minimal change.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.5B GREEN code written ✅

---

### 13.6B GREEN proof run

Run: `npm test`

- [ ] 13.6B GREEN confirmed ✅

---

### 13.7B GREEN commit

Run:
   ```
   git add .
   git commit -m "green: Controls reflects grayscale prop on checkbox"
   ```

- [ ] 13.7B GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 13.2C RED — `Controls` renders blur checked state from prop

**Agent prompt**
Add one test to `Controls.test.tsx`: when `Controls` is rendered with `blur={true}`, the blur checkbox is checked.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.2C RED test written ✅

---

### 13.3C RED proof run

Run: `npm test`

- [ ] 13.3C RED confirmed ✅

---

### 13.4C RED commit

Run:
   ```
   git add .
   git commit -m "red: Controls reflects blur prop on checkbox"
   ```

- [ ] 13.4C RED committed ✅

---

### 13.5C GREEN — pass `blur` prop to checkbox

**Agent prompt**
Add optional `blur?: boolean` prop to `Controls`. Bind it to the blur checkbox's `checked`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.5C GREEN code written ✅

---

### 13.6C GREEN proof run

Run: `npm test`

- [ ] 13.6C GREEN confirmed ✅

---

### 13.7C GREEN commit

Run:
   ```
   git add .
   git commit -m "green: Controls reflects blur prop on checkbox"
   ```

- [ ] 13.7C GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 13.2D RED — changing height updates preview URL

**Agent prompt**
Add one integration test to `PicsumLabPage.integration.test.tsx`: after the gallery loads and a photo is selected, typing a new value into the height input changes the preview image's `src` so the URL path includes the new height.

**Reference docs**
- [`user-stories.md`](./user-stories.md) — Story C.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.2D RED test written ✅

---

### 13.3D RED proof run

Run: `npm test`

- [ ] 13.3D RED confirmed ✅

---

### 13.4D RED commit

Run:
   ```
   git add .
   git commit -m "red: height input changes preview URL"
   ```

- [ ] 13.4D RED committed ✅

---

### 13.5D GREEN — lift `height` into page state

**Agent prompt**
In `PicsumLabPage.tsx`: add `height` state (seeded from `prefs.height`). Pass `height` and `onHeightChange={setHeight}` to `Controls`. Use the state value in `buildPicsumImageUrl` instead of the hard-coded `400`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.5D GREEN code written ✅

---

### 13.6D GREEN proof run

Run: `npm test`

- [ ] 13.6D GREEN confirmed ✅

---

### 13.7D GREEN commit

Run:
   ```
   git add .
   git commit -m "green: height state drives preview URL"
   ```

- [ ] 13.7D GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 13.2E RED — toggling grayscale adds `?grayscale` to preview URL

**Agent prompt**
Add one integration test: after a photo is selected, clicking the grayscale checkbox makes the preview image's `src` include `grayscale`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.2E RED test written ✅

---

### 13.3E RED proof run

Run: `npm test`

- [ ] 13.3E RED confirmed ✅

---

### 13.4E RED commit

Run:
   ```
   git add .
   git commit -m "red: grayscale toggle changes preview URL"
   ```

- [ ] 13.4E RED committed ✅

---

### 13.5E GREEN — lift `effects` into page state (grayscale)

**Agent prompt**
In `PicsumLabPage.tsx`: add `effects` state (seeded with `{ grayscale: false, blur: false }`). Pass `grayscale={effects.grayscale}` and `onGrayscaleChange={(enabled) => setEffects(e => ({ ...e, grayscale: enabled }))}` to `Controls`. Feed `effects` into `buildPicsumImageUrl`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.5E GREEN code written ✅

---

### 13.6E GREEN proof run

Run: `npm test`

- [ ] 13.6E GREEN confirmed ✅

---

### 13.7E GREEN commit

Run:
   ```
   git add .
   git commit -m "green: grayscale effect drives preview URL"
   ```

- [ ] 13.7E GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 13.2F RED — toggling blur adds `?blur` to preview URL

**Agent prompt**
Add one integration test: after a photo is selected, clicking the blur checkbox makes the preview image's `src` include `blur`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.2F RED test written ✅

---

### 13.3F RED proof run

Run: `npm test`

- [ ] 13.3F RED confirmed ✅

---

### 13.4F RED commit

Run:
   ```
   git add .
   git commit -m "red: blur toggle changes preview URL"
   ```

- [ ] 13.4F RED committed ✅

---

### 13.5F GREEN — wire blur into `effects` state

**Agent prompt**
Pass `blur={effects.blur}` and an `onBlurChange` handler that updates `effects.blur`. No other changes.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.5F GREEN code written ✅

---

### 13.6F GREEN proof run

Run: `npm test`

- [ ] 13.6F GREEN confirmed ✅

---

### 13.7F GREEN commit

Run:
   ```
   git add .
   git commit -m "green: blur effect drives preview URL"
   ```

- [ ] 13.7F GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 13.8 REFACTOR — Agent cleans up

**Agent prompt**
In `PicsumLabPage.tsx`, consider whether the three effect toggle handlers can be reduced to a single `setEffects(patch)` helper. Ensure `Controls` prop names and ordering are consistent with other controlled inputs. No behavior changes.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 13.8 REFACTOR written ✅

---

### 13.9 REFACTOR proof run

Run: `npm test`

- [ ] 13.9 REFACTOR confirmed ✅

---

### 13.10 REFACTOR commit

Run:
   ```
   git add .
   git commit -m "refactor: consolidate effect handlers in page state"
   ```

- [ ] 13.10 REFACTOR committed ✅

---

### 13.11 PR + squash merge

Run: `git push -u origin tdd/wire-size-and-effects`

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   fix: wire height, grayscale, and blur controls through preview URL
   ```

- [ ] 13.11 Merged to `main` ✅

---

### 13.12 Post-merge cleanup

Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/wire-size-and-effects
   git push origin --delete tdd/wire-size-and-effects
   git log --oneline -n 5
   ```

- [ ] 13.12 Cleanup done ✅

---


## Step 15 — Cycle: Persist prefs to localStorage with expanded shape

**Goal**
`PicsumLabPrefsData` carries `selectedPhotoId` and `effects` in addition to `width`/`height`. `useLocalStorageState` returns a `[value, setValue]` pair and writes back on updates. The corresponding guard validates the expanded shape.

---

### 15.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/persist-prefs-expanded
   ```

- [ ] 15.1 Branch created ✅

---

### 15.2A RED — guard rejects prefs missing `selectedPhotoId`

**Agent prompt**
Add one test to `guards.test.ts` (create if absent): `isStoredPicsumLabPrefsV1` returns `false` for a blob whose `data` has `width` and `height` but no `selectedPhotoId`.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `StoredPicsumLabPrefsV1.data.selectedPhotoId: string | null`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.2A RED test written ✅

---

### 15.3A RED proof run

Run: `npm test`

- [ ] 15.3A RED confirmed ✅

---

### 15.4A RED commit

Run:
   ```
   git add .
   git commit -m "red: stored prefs guard requires selectedPhotoId"
   ```

- [ ] 15.4A RED committed ✅

---

### 15.5A GREEN — extend type + guard for `selectedPhotoId`

**Agent prompt**
Add `selectedPhotoId: string | null` to `PicsumLabPrefsData` in `types.ts`. In `isStoredPicsumLabPrefsV1`, add a `'selectedPhotoId' in data` check that passes when the value is `string` or `null`. Update `DEFAULT_PREFS` in `PicsumLabPage.tsx` to include `selectedPhotoId: null`. Minimal change.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.5A GREEN code written ✅

---

### 15.6A GREEN proof run

Run: `npm test`

- [ ] 15.6A GREEN confirmed ✅

---

### 15.7A GREEN commit

Run:
   ```
   git add .
   git commit -m "green: stored prefs include selectedPhotoId"
   ```

- [ ] 15.7A GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 15.2B RED — guard rejects prefs missing `effects`

**Agent prompt**
Add one test to `guards.test.ts`: `isStoredPicsumLabPrefsV1` returns `false` for a blob whose `data` has no `effects` object.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.2B RED test written ✅

---

### 15.3B RED proof run

Run: `npm test`

- [ ] 15.3B RED confirmed ✅

---

### 15.4B RED commit

Run:
   ```
   git add .
   git commit -m "red: stored prefs guard requires effects"
   ```

- [ ] 15.4B RED committed ✅

---

### 15.5B GREEN — extend type + guard for `effects`

**Agent prompt**
Add `effects: ImageEffects` to `PicsumLabPrefsData`. In `isStoredPicsumLabPrefsV1`, validate `data.effects` is an object with `grayscale: boolean` and `blur: boolean`. Update `DEFAULT_PREFS` accordingly.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.5B GREEN code written ✅

---

### 15.6B GREEN proof run

Run: `npm test`

- [ ] 15.6B GREEN confirmed ✅

---

### 15.7B GREEN commit

Run:
   ```
   git add .
   git commit -m "green: stored prefs include effects"
   ```

- [ ] 15.7B GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 15.2C RED — `useLocalStorageState` exposes a setter

**Agent prompt**
Add one test to `useLocalStorageState.test.ts`: calling the hook returns a tuple whose second entry is a function. (The first entry is still the hydrated/default value.)

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.2C RED test written ✅

---

### 15.3C RED proof run

Run: `npm test`

- [ ] 15.3C RED confirmed ✅

---

### 15.4C RED commit

Run:
   ```
   git add .
   git commit -m "red: useLocalStorageState returns [value, setter]"
   ```

- [ ] 15.4C RED committed ✅

---

### 15.5C GREEN — return `[value, setValue]` tuple

**Agent prompt**
Change `useLocalStorageState` to return `readonly [T, (next: T) => void]`. Back the value with `useState` seeded by the existing read/validate logic. The setter updates internal state only for now (no persistence yet). Update `PicsumLabPage.tsx` to destructure the tuple — keep only the read path working as before.

**Reference docs**
- [`architecture.md`](./architecture.md) — persistence data flow: "state change → effect → serialize".

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.5C GREEN code written ✅

---

### 15.6C GREEN proof run

Run: `npm test`

- [ ] 15.6C GREEN confirmed ✅

---

### 15.7C GREEN commit

Run:
   ```
   git add .
   git commit -m "green: useLocalStorageState returns [value, setter] tuple"
   ```

- [ ] 15.7C GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 15.2D RED — setter writes a `StoredPicsumLabPrefsV1` envelope

**Agent prompt**
Add one test to `useLocalStorageState.test.ts`: calling the returned setter with new data causes `localStorage.getItem(key)` to contain a JSON string with `version: 1`, a `savedAt` string, and the exact `data` payload.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.2D RED test written ✅

---

### 15.3D RED proof run

Run: `npm test`

- [ ] 15.3D RED confirmed ✅

---

### 15.4D RED commit

Run:
   ```
   git add .
   git commit -m "red: useLocalStorageState setter persists envelope"
   ```

- [ ] 15.4D RED committed ✅

---

### 15.5D GREEN — serialize and write on setter call

**Agent prompt**
In the setter returned by `useLocalStorageState`, build `{ version: 1, savedAt: new Date().toISOString(), data: next }` and `localStorage.setItem(key, JSON.stringify(...))` before updating state. Minimal change.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.5D GREEN code written ✅

---

### 15.6D GREEN proof run

Run: `npm test`

- [ ] 15.6D GREEN confirmed ✅

---

### 15.7D GREEN commit

Run:
   ```
   git add .
   git commit -m "green: useLocalStorageState setter persists versioned envelope"
   ```

- [ ] 15.7D GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 15.2E RED — integration: changes are persisted across remounts

**Agent prompt**
Add one integration test to `PicsumLabPage.integration.test.tsx`: after the gallery loads, select a photo, change width, toggle grayscale. Unmount, clear the gallery mock to the same fixture, remount. Assert the width input value and the preview URL reflect the previously-set state (hydrated from localStorage).

**Reference docs**
- [`user-stories.md`](./user-stories.md) — Story D.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.2E RED test written ✅

---

### 15.3E RED proof run

Run: `npm test`

- [ ] 15.3E RED confirmed ✅

---

### 15.4E RED commit

Run:
   ```
   git add .
   git commit -m "red: user preferences restore across remount"
   ```

- [ ] 15.4E RED committed ✅

---

### 15.5E GREEN — drive page state through the setter

**Agent prompt**
In `PicsumLabPage.tsx`: replace ad-hoc `useState` for `width`, `height`, `selectedPhotoId`, and `effects` with a single `const [prefs, setPrefs] = useLocalStorageState(PREFS_KEY, DEFAULT_PREFS, isStoredPicsumLabPrefsV1)`. Derive values from `prefs`. Every change handler should call `setPrefs({ ...prefs, ... })`. Do not break existing tests.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.5E GREEN code written ✅

---

### 15.6E GREEN proof run

Run: `npm test`

- [ ] 15.6E GREEN confirmed ✅

---

### 15.7E GREEN commit

Run:
   ```
   git add .
   git commit -m "green: page state persists via useLocalStorageState"
   ```

- [ ] 15.7E GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 15.8 REFACTOR — Agent cleans up

**Agent prompt**
Move the read and write helpers from the hook into `lib/localStorageStore.ts` (e.g. `readStored<T>(key, validate, defaults)` and `writeStored<T>(key, data)`). Keep the hook thin. No behavior changes.

**Reference docs**
- [`architecture.md`](./architecture.md) — `lib/` for infrastructure helpers.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 15.8 REFACTOR written ✅

---

### 15.9 REFACTOR proof run

Run: `npm test`

- [ ] 15.9 REFACTOR confirmed ✅

---

### 15.10 REFACTOR commit

Run:
   ```
   git add .
   git commit -m "refactor: move storage read/write helpers to lib"
   ```

- [ ] 15.10 REFACTOR committed ✅

---

### 15.11 PR + squash merge

Run: `git push -u origin tdd/persist-prefs-expanded`

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   feat: persist full user preferences (selection + effects) to localStorage
   ```

- [ ] 15.11 Merged to `main` ✅

---

### 15.12 Post-merge cleanup

Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/persist-prefs-expanded
   git push origin --delete tdd/persist-prefs-expanded
   git log --oneline -n 5
   ```

- [ ] 15.12 Cleanup done ✅

---

## Step 16 — Cycle: Loading state + stale-selection reconcile

**Goal**
User story A step 2: the gallery renders a loading indicator while fetching. User story D: a persisted `selectedPhotoId` that is missing from the new list is reset (falls back to `null`).

---

### 16.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/loading-and-stale-selection
   ```

- [ ] 16.1 Branch created ✅

---

### 16.2A RED — loading status renders an indicator

**Agent prompt**
Add one test to `PicsumLabPage.test.tsx`: while the gallery fetch is pending (mock never resolves during assertion), an element with role `status` and accessible name `Loading gallery` is rendered inside the Gallery section.

**Reference docs**
- [`user-stories.md`](./user-stories.md) — Story A step 2.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 16.2A RED test written ✅

---

### 16.3A RED proof run

Run: `npm test`

- [ ] 16.3A RED confirmed ✅

---

### 16.4A RED commit

Run:
   ```
   git add .
   git commit -m "red: gallery shows loading indicator while fetching"
   ```

- [ ] 16.4A RED committed ✅

---

### 16.5A GREEN — render loading branch

**Agent prompt**
In `PicsumLabPage.tsx`, render a `<p role="status">Loading gallery</p>` when `galleryState.status === 'loading'` or `'idle'`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 16.5A GREEN code written ✅

---

### 16.6A GREEN proof run

Run: `npm test`

- [ ] 16.6A GREEN confirmed ✅

---

### 16.7A GREEN commit

Run:
   ```
   git add .
   git commit -m "green: render loading indicator for pending gallery fetch"
   ```

- [ ] 16.7A GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 16.2B RED — stale `selectedPhotoId` is reset after load

**Agent prompt**
Add one integration test: seed `localStorage` with a valid prefs blob whose `selectedPhotoId` is not in the fetched gallery list. After load resolves, assert (a) no gallery row has `aria-pressed="true"`, and (b) preview renders its empty state.

**Reference docs**
- [`user-stories.md`](./user-stories.md) — Story D: "If the stored id is missing from the new list, selection falls back".

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 16.2B RED test written ✅

---

### 16.3B RED proof run

Run: `npm test`

- [ ] 16.3B RED confirmed ✅

---

### 16.4B RED commit

Run:
   ```
   git add .
   git commit -m "red: stale selectedPhotoId falls back to none after list load"
   ```

- [ ] 16.4B RED committed ✅

---

### 16.5B GREEN — reconcile selection when list arrives

**Agent prompt**
In `PicsumLabPage.tsx`, add a `useEffect` that runs when `galleryState.status === 'success'`: if the current `selectedPhotoId` is not in `galleryState.photos`, call `setPrefs({ ...prefs, selectedPhotoId: null })`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 16.5B GREEN code written ✅

---

### 16.6B GREEN proof run

Run: `npm test`

- [ ] 16.6B GREEN confirmed ✅

---

### 16.7B GREEN commit

Run:
   ```
   git add .
   git commit -m "green: clear stale selectedPhotoId after gallery loads"
   ```

- [ ] 16.7B GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 16.8 REFACTOR — Agent cleans up

**Agent prompt**
Consider extracting the reconcile logic into a small helper `reconcileSelection(photos, id)` in `model/` so it is testable as a pure function. No behavior changes.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 16.8 REFACTOR written ✅

---

### 16.9 REFACTOR proof run

Run: `npm test`

- [ ] 16.9 REFACTOR confirmed ✅

---

### 16.10 REFACTOR commit

Run:
   ```
   git add .
   git commit -m "refactor: extract selection reconciliation helper"
   ```

- [ ] 16.10 REFACTOR committed ✅

---

### 16.11 PR + squash merge

Run: `git push -u origin tdd/loading-and-stale-selection`

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   feat: render loading state and drop stale persisted selection on reload
   ```

- [ ] 16.11 Merged to `main` ✅

---

### 16.12 Post-merge cleanup

Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/loading-and-stale-selection
   git push origin --delete tdd/loading-and-stale-selection
   git log --oneline -n 5
   ```

- [ ] 16.12 Cleanup done ✅

---

## Step 17 — Cycle: Thumbnail grid + two-column layout

**Goal**
`GalleryRow` shows an image thumbnail (not just text). `PicsumLabPage` lays out gallery on the left and preview on the right.

---

### 17.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/grid-layout
   ```

- [ ] 17.1 Branch created ✅

---

### 17.2A RED — `GalleryRow` renders a thumbnail `<img>`

**Agent prompt**
Add one test to `GalleryRow.test.tsx`: given a photo with `download_url`, the rendered row contains an `<img>` whose `src` is a non-empty string referencing the photo (e.g. contains `/id/{photo.id}/`). Use role `img` or `getByRole('img')` to locate it.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 17.2A RED test written ✅

---

### 17.3A RED proof run

Run: `npm test`

- [ ] 17.3A RED confirmed ✅

---

### 17.4A RED commit

Run:
   ```
   git add .
   git commit -m "red: GalleryRow renders a thumbnail image"
   ```

- [ ] 17.4A RED committed ✅

---

### 17.5A GREEN — render thumbnail in `GalleryRow`

**Agent prompt**
Update `GalleryRow.tsx`: inside the `<button>`, render an `<img>` using `buildPicsumImageUrl({ source: { kind: 'id', id: photo.id }, width: 120, height: 80, effects: { grayscale: false, blur: false } })` as the `src`. Keep the author text. Minimal change.

**Reference docs**
- [`schema-remote.md`](./schema-remote.md) — id-based URL pattern.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 17.5A GREEN code written ✅

---

### 17.6A GREEN proof run

Run: `npm test`

- [ ] 17.6A GREEN confirmed ✅

---

### 17.7A GREEN commit

Run:
   ```
   git add .
   git commit -m "green: GalleryRow renders a thumbnail image"
   ```

- [ ] 17.7A GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 17.2B RED — thumbnail uses author as alt text

**Agent prompt**
Add one test to `GalleryRow.test.tsx`: the thumbnail's accessible name equals `photo.author`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 17.2B RED test written ✅

---

### 17.3B RED proof run

Run: `npm test`

- [ ] 17.3B RED confirmed ✅

---

### 17.4B RED commit

Run:
   ```
   git add .
   git commit -m "red: thumbnail alt text uses author name"
   ```

- [ ] 17.4B RED committed ✅

---

### 17.5B GREEN — add `alt={photo.author}`

**Agent prompt**
Add `alt={photo.author}` to the thumbnail `<img>` in `GalleryRow.tsx`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 17.5B GREEN code written ✅

---

### 17.6B GREEN proof run

Run: `npm test`

- [ ] 17.6B GREEN confirmed ✅

---

### 17.7B GREEN commit

Run:
   ```
   git add .
   git commit -m "green: thumbnail alt text uses author name"
   ```

- [ ] 17.7B GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 17.2C RED — page is split into two landmark regions

**Agent prompt**
Add one test to `PicsumLabPage.test.tsx`: the page renders a container with `data-testid="lab-layout"`; inside that container, the Gallery region (`aria-label="Gallery"`) has `data-testid="layout-left"` and the Preview region (`aria-label="Preview"`) has `data-testid="layout-right"`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 17.2C RED test written ✅

---

### 17.3C RED proof run

Run: `npm test`

- [ ] 17.3C RED confirmed ✅

---

### 17.4C RED commit

Run:
   ```
   git add .
   git commit -m "red: page exposes left/right layout regions"
   ```

- [ ] 17.4C RED committed ✅

---

### 17.5C GREEN — wrap gallery and preview in a two-column container

**Agent prompt**
Wrap the Gallery and Preview sections in a container div `data-testid="lab-layout"`. Add `data-testid="layout-left"` to the Gallery section and `data-testid="layout-right"` to the Preview section. Controls may live inside the right column below the preview (or above, agent's choice). Add minimal inline `style` (flex row with gap) or a dedicated CSS class — either is acceptable.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 17.5C GREEN code written ✅

---

### 17.6C GREEN proof run

Run: `npm test`

- [ ] 17.6C GREEN confirmed ✅

---

### 17.7C GREEN commit

Run:
   ```
   git add .
   git commit -m "green: two-column layout with gallery left, preview right"
   ```

- [ ] 17.7C GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 17.8 REFACTOR — Agent cleans up

**Agent prompt**
Move inline layout styles into `PicsumLabPage.module.css` (or the existing CSS file) and apply via `className`. If `Gallery` still renders `<ul>`, ensure it is a grid of rows (CSS grid/flex wrap) so many photos are browsable at a glance. No behavior changes.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 17.8 REFACTOR written ✅

---

### 17.9 REFACTOR proof run

Run: `npm test`

- [ ] 17.9 REFACTOR confirmed ✅

---

### 17.10 REFACTOR commit

Run:
   ```
   git add .
   git commit -m "refactor: move layout styles into stylesheet"
   ```

- [ ] 17.10 REFACTOR committed ✅

---

### 17.11 PR + squash merge

Run: `git push -u origin tdd/grid-layout`

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   feat: render gallery thumbnails in a grid with preview docked to the right
   ```

- [ ] 17.11 Merged to `main` ✅

---

### 17.12 Post-merge cleanup

Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/grid-layout
   git push origin --delete tdd/grid-layout
   git log --oneline -n 5
   ```

- [ ] 17.12 Cleanup done ✅

---

## Step 18 — Cycle: Blur amount control

**Goal**
Expose a 1–10 blur amount input in `Controls`. The amount is only active when blur is on.

---

### 18.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/blur-amount-control
   ```

- [ ] 18.1 Branch created ✅

---

### 18.2A RED — blur amount input calls `onBlurAmountChange`

**Agent prompt**
Add one test to `Controls.test.tsx`: rendering `Controls` with `blur={true}` and an `onBlurAmountChange` spy, changing the blur-amount input to `7` calls the spy with the number `7`.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `ImageEffects.blurAmount?: 1..10`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 18.2A RED test written ✅

---

### 18.3A RED proof run

Run: `npm test`

- [ ] 18.3A RED confirmed ✅

---

### 18.4A RED commit

Run:
   ```
   git add .
   git commit -m "red: blur amount input calls onBlurAmountChange with number"
   ```

- [ ] 18.4A RED committed ✅

---

### 18.5A GREEN — add blur amount input

**Agent prompt**
Add a numeric input (`type="range"` or `type="number"`, `min={1}`, `max={10}`) labeled "Blur amount" to `Controls.tsx`. On change, call `onBlurAmountChange` with `Number(event.target.value)`. Only render it when `blur === true`. Minimal change.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 18.5A GREEN code written ✅

---

### 18.6A GREEN proof run

Run: `npm test`

- [ ] 18.6A GREEN confirmed ✅

---

### 18.7A GREEN commit

Run:
   ```
   git add .
   git commit -m "green: blur amount input emits onBlurAmountChange"
   ```

- [ ] 18.7A GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 18.2B RED — blur amount input hidden when blur is off

**Agent prompt**
Add one test to `Controls.test.tsx`: when `Controls` is rendered with `blur={false}`, there is no blur-amount input in the DOM (`queryByLabelText('Blur amount')` returns `null`).

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 18.2B RED test written ✅

---

### 18.3B RED proof run

Run: `npm test`

- [ ] 18.3B RED confirmed ✅

---

### 18.4B RED commit

Run:
   ```
   git add .
   git commit -m "red: blur amount input is hidden when blur is off"
   ```

- [ ] 18.4B RED committed ✅

---

### 18.5B GREEN — conditionally render amount input

**Agent prompt**
Gate the blur amount input behind `blur === true` in `Controls.tsx`. Should already follow from 18.5A; if not, adjust.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 18.5B GREEN code written ✅

---

### 18.6B GREEN proof run

Run: `npm test`

- [ ] 18.6B GREEN confirmed ✅

---

### 18.7B GREEN commit

Run:
   ```
   git add .
   git commit -m "green: blur amount input only rendered when blur is on"
   ```

- [ ] 18.7B GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 18.2C RED — integration: blur amount updates preview URL

**Agent prompt**
Add one integration test: after a photo is selected and blur is toggled on, changing the blur-amount input to `5` makes the preview image's `src` contain `blur=5`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 18.2C RED test written ✅

---

### 18.3C RED proof run

Run: `npm test`

- [ ] 18.3C RED confirmed ✅

---

### 18.4C RED commit

Run:
   ```
   git add .
   git commit -m "red: blur amount change updates preview URL with blur=N"
   ```

- [ ] 18.4C RED committed ✅

---

### 18.5C GREEN — wire `blurAmount` through page state

**Agent prompt**
In `PicsumLabPage.tsx`: pass `blurAmount={prefs.effects.blurAmount}` and `onBlurAmountChange={(amount) => setPrefs({ ...prefs, effects: { ...prefs.effects, blurAmount: amount as 1|2|...|10 } })}` to `Controls`. Ensure the `effects` fed into `buildPicsumImageUrl` carries `blurAmount`.

**Reference docs**
- [`schema-app.md`](./schema-app.md) — `ImageEffects.blurAmount` union type.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 18.5C GREEN code written ✅

---

### 18.6C GREEN proof run

Run: `npm test`

- [ ] 18.6C GREEN confirmed ✅

---

### 18.7C GREEN commit

Run:
   ```
   git add .
   git commit -m "green: blur amount flows into preview URL via effects state"
   ```

- [ ] 18.7C GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 18.8 REFACTOR — Agent cleans up

**Agent prompt**
If the `blurAmount` cast is ugly, add a small `toBlurAmount(n: number): ImageEffects['blurAmount']` helper in `model/` that clamps to 1..10. No behavior changes.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 18.8 REFACTOR written ✅

---

### 18.9 REFACTOR proof run

Run: `npm test`

- [ ] 18.9 REFACTOR confirmed ✅

---

### 18.10 REFACTOR commit

Run:
   ```
   git add .
   git commit -m "refactor: centralise blur amount clamping"
   ```

- [ ] 18.10 REFACTOR committed ✅

---

### 18.11 PR + squash merge

Run: `git push -u origin tdd/blur-amount-control`

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   feat: add blur amount (1-10) control to preview effects
   ```

- [ ] 18.11 Merged to `main` ✅

---

### 18.12 Post-merge cleanup

Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/blur-amount-control
   git push origin --delete tdd/blur-amount-control
   git log --oneline -n 5
   ```

- [ ] 18.12 Cleanup done ✅

---

## Step 19 — Cycle: Default selection on first load

**Goal**
When there is no persisted `selectedPhotoId` and the gallery has just loaded, the first photo becomes the selected one so the preview is never empty on a fresh session.

---

### 19.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/default-selection
   ```

- [ ] 19.1 Branch created ✅

---

### 19.2A RED — first row is selected by default on fresh load

**Agent prompt**
Add one integration test to `PicsumLabPage.integration.test.tsx`: with no prefs in `localStorage`, after the gallery fetch resolves, the first gallery row has `aria-pressed="true"` and the preview `<img>` `src` contains `/id/{firstPhoto.id}/`.

**Reference docs**
- [`user-stories.md`](./user-stories.md) — Story A note on default selection; Story B for selection semantics.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 19.2A RED test written ✅

---

### 19.3A RED proof run

Run: `npm test`

- [ ] 19.3A RED confirmed ✅

---

### 19.4A RED commit

Run:
   ```
   git add .
   git commit -m "red: first photo is selected by default on fresh load"
   ```

- [ ] 19.4A RED committed ✅

---

### 19.5A GREEN — seed selection from first photo when none is set

**Agent prompt**
Extend the post-load reconcile effect from Step 16.5B: when `galleryState.status === 'success'` and `prefs.selectedPhotoId === null` and `photos.length > 0`, call `setPrefs({ ...prefs, selectedPhotoId: photos[0].id })`. Minimal change.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 19.5A GREEN code written ✅

---

### 19.6A GREEN proof run

Run: `npm test`

- [ ] 19.6A GREEN confirmed ✅

---

### 19.7A GREEN commit

Run:
   ```
   git add .
   git commit -m "green: auto-select first photo when no selection is persisted"
   ```

- [ ] 19.7A GREEN committed ✅

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

---

### 19.8 REFACTOR — Agent cleans up

**Agent prompt**
If Step 16's `reconcileSelection(photos, id)` already folds in the default-to-first case, inline the behavior there and remove duplication. No behavior changes.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 19.8 REFACTOR written ✅

---

### 19.9 REFACTOR proof run

Run: `npm test`

- [ ] 19.9 REFACTOR confirmed ✅

---

### 19.10 REFACTOR commit

Run:
   ```
   git add .
   git commit -m "refactor: fold default selection into reconcile helper"
   ```

- [ ] 19.10 REFACTOR committed ✅

---

### 19.11 PR + squash merge

Run: `git push -u origin tdd/default-selection`

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   feat: select first gallery photo by default on fresh sessions
   ```

- [ ] 19.11 Merged to `main` ✅

---

### 19.12 Post-merge cleanup

Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/default-selection
   git push origin --delete tdd/default-selection
   git log --oneline -n 5
   ```

- [ ] 19.12 Cleanup done ✅

---

## Step 21 — Cycle: Gallery column scrolls independently

**Goal**
The gallery (left column) is the only part of the page that scrolls on a long list. The preview + controls (right column) stay pinned in the viewport without scrolling the whole page.

---

### 21.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/gallery-only-scroll
   ```

- [ ] 21.1 Branch created ✅

---

### 21.2A RED — layout-left declares itself as the scroll container

**Agent prompt**
Add one test to `PicsumLabPage.test.tsx`: the element with `data-testid="layout-left"` also has a `data-scroll-container` attribute. This signals in the markup that the left column is the viewport-bound scroll region; CSS realizes the actual `overflow-y: auto` behavior.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 21.2A RED test written ✅

---

### 21.3A RED proof run

Run: `npm test`

- [ ] 21.3A RED confirmed ✅

---

### 21.4A RED commit

Run:
   ```
   git add .
   git commit -m "red: layout-left declares scroll-container attribute"
   ```

- [ ] 21.4A RED committed ✅

---

### 21.5A GREEN — annotate element and add scrolling CSS

**Agent prompt**
In `PicsumLabPage.tsx`, add `data-scroll-container` to the `layout-left` div. In `PicsumLabPage.css`:
- make `.lab-layout` fill the available flex space (`flex: 1; min-height: 0;`)
- give `.lab-layout__left` `overflow-y: auto` and `min-height: 0` so it scrolls inside the constrained layout
- keep `.lab-layout__right` naturally sized (preview + controls stay in view)

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 21.5A GREEN code written ✅

---

### 21.6A GREEN proof run

Run: `npm test`

- [ ] 21.6A GREEN confirmed ✅

---

### 21.7A GREEN commit

Run:
   ```
   git add .
   git commit -m "green: gallery column scrolls independently within bounded layout"
   ```

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

- [ ] 21.7A GREEN committed ✅

---

### 21.8 REFACTOR — Agent cleans up

**Agent prompt**
Audit `PicsumLabPage.css` for any rules made redundant by the new height constraints. Remove dead rules. No behavior changes.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 21.8 REFACTOR written ✅

---

### 21.9 REFACTOR proof run

Run: `npm test`

- [ ] 21.9 REFACTOR confirmed ✅

---

### 21.10 REFACTOR commit

Run:
   ```
   git add .
   git commit -m "refactor: tighten layout stylesheet after scroll constraint"
   ```

- [ ] 21.10 REFACTOR committed ✅

---

### 21.11 PR + squash merge

Run: `git push -u origin tdd/gallery-only-scroll`

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   feat: make gallery column the only scroll region in the lab layout
   ```

- [ ] 21.11 Merged to `main` ✅

---

### 21.12 Post-merge cleanup

Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/gallery-only-scroll
   git push origin --delete tdd/gallery-only-scroll
   git log --oneline -n 5
   ```

- [ ] 21.12 Cleanup done ✅

---

## Step 22 — Cycle: Fix blur URL / slider mismatch on toggle

**Goal**
When blur is turned on with no `blurAmount` set, the URL currently emits bare `?blur` which Picsum interprets as its own default (heavy blur). The slider meanwhile displays `1`. Make them agree by always emitting `blur=N` where N matches the slider's shown value (`blurAmount ?? 1`).

---

### 22.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b fix/blur-amount-default
   ```

- [ ] 22.1 Branch created ✅

---

### 22.2A RED — query builder emits `blur=1` when blurAmount is undefined

**Agent prompt**
Add one test to `buildPicsumImageUrl.test.ts`: when `effects.blur` is `true` and `blurAmount` is `undefined`, the URL contains `blur=1` (not bare `?blur`). This matches what the slider defaults to in `Controls`.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 22.2A RED test written ✅

---

### 22.3A RED proof run

Run: `npm test`

- [ ] 22.3A RED confirmed ✅

---

### 22.4A RED commit

Run:
   ```
   git add .
   git commit -m "red: blur without amount emits blur=1 to match slider"
   ```

- [ ] 22.4A RED committed ✅

---

### 22.5A GREEN — fallback to 1 in query builder

**Agent prompt**
In `buildEffectsQuery.ts`, when `effects.blur` is `true`, push `blur=${effects.blurAmount ?? 1}` (no longer a bare `blur` branch). Minimal change.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 22.5A GREEN code written ✅

---

### 22.6A GREEN proof run

Run: `npm test`

- [ ] 22.6A GREEN confirmed ✅

---

### 22.7A GREEN commit

Run:
   ```
   git add .
   git commit -m "green: query builder defaults blur amount to 1 when unset"
   ```

**STOP — WAIT** — manual browser test
Verify the newly-green behavior in the running app. Resume only after the user confirms the behavior is correct.

- [ ] 22.7A GREEN committed ✅

---

### 22.11 PR + squash merge

Run: `git push -u origin fix/blur-amount-default`

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   fix: sync blur URL to slider default so a freshly-toggled blur is subtle
   ```

- [ ] 22.11 Merged to `main` ✅

---

### 22.12 Post-merge cleanup

Run:
   ```
   git checkout main
   git pull
   git branch -d fix/blur-amount-default
   git push origin --delete fix/blur-amount-default
   git log --oneline -n 5
   ```

- [ ] 22.12 Cleanup done ✅

---

## Step 20 — Phase 2 integration verification

**Goal**
End-to-end verification that every issue from [`ISSUES.md`](../../ISSUES.md) is resolved. No open branches. `main` is fully green.

---

### 20.1 Branch setup

Run:
   ```
   git checkout main
   git pull
   git checkout -b tdd/phase-2-verification
   ```

- [ ] 20.1 Branch created ✅

---

### 20.2 Full test + build + typecheck run

Run:
   ```
   npm test
   npm run build
   npx tsc --noEmit
   ```

Agent runs all three and fixes any failures before moving on.

- [ ] 20.2 All checks green ✅

---

### 20.3 Manual walkthrough

Perform the following manually in the browser:

- [ ] Height input change updates the image
- [ ] Grayscale toggle changes the image visibly
- [ ] Blur toggle changes the image visibly
- [ ] Blur amount slider (only visible when blur is on) changes strength
- [ ] Reload restores width, height, selection, and effects
- [ ] Clearing localStorage → reload shows first photo selected by default
- [ ] A persisted selection that no longer exists in the list is dropped gracefully
- [ ] Gallery shows a loading indicator before photos appear
- [ ] Gallery is a grid of thumbnails; selecting a thumbnail updates the preview
- [ ] Preview is docked to the right of the gallery (not stacked below)
- [ ] Only the gallery column scrolls when the list is long; preview + controls stay pinned

**STOP — WAIT**
Human action. Wait for confirmation all checks are ticked.

- [ ] 20.3 Manual walkthrough complete ✅

---

### 20.4 Update `ISSUES.md`

**Agent prompt**
In `ISSUES.md`, mark each of issues #1–#12 as resolved (e.g. strike-through or a trailing "✅ resolved in Step N" note). Do not remove the entries.

**NO STOP** — Agent-owned. Continues automatically.

- [ ] 20.4 Issues log updated ✅

---

### 20.5 Commit and squash merge

Run:
   ```
   git add .
   git commit -m "docs: mark Phase 2 issues as resolved"
   git push -u origin tdd/phase-2-verification
   ```

**STOP — WAIT** — human action
Open a PR on GitHub and squash-merge with message:
   ```
   docs: close out Phase 2 issue log
   ```

- [ ] 20.5 Merged to `main` ✅

---

### 20.6 Post-merge cleanup and final log

Run:
   ```
   git checkout main
   git pull
   git branch -d tdd/phase-2-verification
   git push origin --delete tdd/phase-2-verification
   git log --oneline -n 20
   ```

- [ ] 20.6 Final log captured ✅

---

## Commit message quick reference

| Stage | Format |
|-------|--------|
| RED on branch | `red: <behavior>` |
| GREEN on branch | `green: <behavior>` |
| REFACTOR on branch | `refactor: <what improved>` |
| Squash on `main` | `feat: <completed behavior>` |
| Fix on `main` | `fix: <corrected behavior>` |
| Test-only on `main` | `test: <what is covered>` |
