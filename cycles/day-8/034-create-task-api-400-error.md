---
id: cycle-034
slug: create-task-api-400-error
status: pending
source: "Checklist §3: Show validation errors from the backend (400) inline (User Story F)"
covers: error-path
---
## Behavior
When `POST /tasks` returns a 400, `createTask` throws an `Error` whose message carries the backend validation message(s) so the form layer can surface them. The backend returns `{ message: string | string[], statusCode, error }`; `createTask` reads `message`, joins arrays into a single string, and throws `new Error(thatMessage)`.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts
- Assertion:
```ts
it('throws with the backend validation message on 400', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => ({ statusCode: 400, error: 'Bad Request', message: ['title should not be empty'] }),
  })
  vi.stubGlobal('fetch', fetchMock)

  await expect(
    createTask({ title: '', description: null, status: 'OPEN' }),
  ).rejects.toThrow('title should not be empty')
})
```
- Why it fails: After cycle-033 `createTask` throws a generic `Failed to create task: 400` and never reads the backend `message`, so the assertion on the message text fails.

## GREEN
- Smallest change: In `createTask`, on `!res.ok` parse the body, read `body.message`, join an array with `', '`, fall back to a status-based string, and `throw new Error(message)`.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.ts

## REFACTOR
Extract a `throwApiError(res)` helper reused by updateTask/deleteTask; defer until those exist.
