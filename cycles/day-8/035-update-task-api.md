---
id: cycle-035
slug: update-task-api
status: done
source: "Checklist §2/§4: updateTask(id) partial PATCH; UpdateTaskInput type (User Story C)"
covers: happy-path
---
## Behavior
`updateTask(id, input)` PATCHes a partial `UpdateTaskInput` (any subset of title/description/status) as JSON to `PATCH /tasks/:id` and returns the updated `Task`. Only the provided fields are sent in the body.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts
- Assertion:
```ts
import { updateTask } from './api'

describe('updateTask', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('PATCHes the partial input as JSON and returns the updated task', async () => {
    const updated = {
      id: 'task-0001',
      title: 'Buy oat milk',
      description: 'Full fat',
      status: 'OPEN',
      userId: null,
      createdAt: 'x',
      updatedAt: 'y',
    }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => updated })
    vi.stubGlobal('fetch', fetchMock)

    const result = await updateTask('task-0001', { title: 'Buy oat milk' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('http://localhost:3001/tasks/task-0001')
    expect(init.method).toBe('PATCH')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ title: 'Buy oat milk' })
    expect(result).toEqual(updated)
  })
})
```
- Why it fails: `updateTask` is not exported from `lib/api.ts`.

## GREEN
- Smallest change: Add `export type UpdateTaskInput = Partial<CreateTaskInput>` and `async function updateTask(id, input)` doing `fetch(apiUrl('/tasks/'+id), { method: 'PATCH', headers: {...}, body: JSON.stringify(input) })`, reusing the cycle-034 error helper on `!res.ok`, returning `res.json()`.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.ts

## REFACTOR
Factor the shared POST/PATCH JSON body + error handling into one private helper now that two callers exist.
