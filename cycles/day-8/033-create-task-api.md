---
id: cycle-033
slug: create-task-api
status: done
source: "Checklist §2: Extend lib/api.ts with createTask; define CreateTaskInput type (User Story A)"
covers: happy-path
---
## Behavior
`createTask(input)` in `lib/api.ts` POSTs a `CreateTaskInput` ({ title, description, status }) as JSON to `POST /tasks` and returns the created `Task` on success. It sets `Content-Type: application/json` and serializes the body, returning the parsed task object.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts
- Assertion:
```ts
import { createTask } from './api'

describe('createTask', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('POSTs the input as JSON and returns the created task', async () => {
    const created = {
      id: 'task-9999',
      title: 'Buy milk',
      description: 'Full fat',
      status: 'OPEN',
      userId: null,
      createdAt: 'x',
      updatedAt: 'x',
    }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => created,
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await createTask({ title: 'Buy milk', description: 'Full fat', status: 'OPEN' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('http://localhost:3001/tasks')
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ title: 'Buy milk', description: 'Full fat', status: 'OPEN' })
    expect(result).toEqual(created)
  })
})
```
- Why it fails: `createTask` does not exist in `lib/api.ts`, so the import is undefined and the call throws.

## GREEN
- Smallest change: Add `export type CreateTaskInput = { title: string; description?: string | null; status: TaskStatus }` and an `async function createTask(input)` that calls `fetch(apiUrl('/tasks'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })`, throws on `!res.ok`, and returns `res.json()`.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.ts

## REFACTOR
Consider a shared `jsonRequest` helper once updateTask lands (cycle-035); none yet.
