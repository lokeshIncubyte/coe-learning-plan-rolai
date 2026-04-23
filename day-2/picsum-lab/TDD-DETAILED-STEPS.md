# Picsum Lab — Detailed TDD Execution Steps

Each cycle covers one behavior. The agent writes all code. Stop points exist only for commands and PR actions that require console output or human approval. Mark each step ✅ when done.

**Rules**
- Agent writes all code — no stops for coding steps.
- Stop only for: commands, PR actions, human approval.
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

- [ ] 02.10 REFACTOR committed ✅

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

- [x] 02.11 Merged to `main` ✅

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

## Commit message quick reference

| Stage | Format |
|-------|--------|
| RED on branch | `red: <behavior>` |
| GREEN on branch | `green: <behavior>` |
| REFACTOR on branch | `refactor: <what improved>` |
| Squash on `main` | `feat: <completed behavior>` |
| Fix on `main` | `fix: <corrected behavior>` |
| Test-only on `main` | `test: <what is covered>` |


