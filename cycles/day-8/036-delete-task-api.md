---
id: cycle-036
slug: delete-task-api
status: done
source: "Checklist §2/§5: deleteTask(id) DELETE /tasks/:id; handle already-deleted 404 (User Story D/E)"
covers: error-path
---
## Behavior
`deleteTask(id)` sends `DELETE /tasks/:id`. It resolves (void) on a successful 2xx. A 404 is treated as already-deleted and also resolves without throwing (idempotent delete). Any other non-ok status throws an `Error` so the optimistic-UI layer can roll back.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts
- Assertion:
```ts
import { deleteTask } from './api'

describe('deleteTask', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('issues a DELETE to /tasks/:id and resolves on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)

    await expect(deleteTask('task-0001')).resolves.toBeUndefined()
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('http://localhost:3001/tasks/task-0001')
    expect(init.method).toBe('DELETE')
  })

  it('treats 404 as already deleted and resolves', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)
    await expect(deleteTask('missing')).resolves.toBeUndefined()
  })

  it('throws on other non-ok statuses so the caller can roll back', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)
    await expect(deleteTask('task-0001')).rejects.toThrow()
  })
})
```
- Why it fails: `deleteTask` is not exported from `lib/api.ts`.

## GREEN
- Smallest change: Add `async function deleteTask(id): Promise<void>` calling `fetch(apiUrl('/tasks/'+id), { method: 'DELETE' })`; `if (res.ok || res.status === 404) return`; else throw.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.ts

## REFACTOR
none
