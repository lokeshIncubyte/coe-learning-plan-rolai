---
id: cycle-026
slug: get-tasks-api
status: done
source: "§4 Create a typed API helper (lib/api.ts) with getTasks() matching {data,total,page,limit}"
covers: happy-path
---

## Behavior
`getTasks(page, limit)` in `lib/api.ts` calls `GET ${NEXT_PUBLIC_API_URL}/tasks?page&limit` with `fetch`, parses the JSON, and returns the paginated envelope `{ data, total, page, limit }` typed against the `Task` type. Default arguments are `page = 1`, `limit = 10`. The function builds the URL from `process.env.NEXT_PUBLIC_API_URL` and uses `{ cache: 'no-store' }` so listing data is always fresh.

## RED
- Test file: `/home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts`
- Assertion:
  ```ts
  import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
  import { getTasks } from './api'

  describe('getTasks', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
    })
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('fetches the paginated tasks envelope from /tasks', async () => {
      const envelope = {
        data: [
          { id: 'task-0001', title: 'Write proposal', description: null, status: 'OPEN', userId: null, createdAt: 'x', updatedAt: 'x' },
        ],
        total: 1,
        page: 1,
        limit: 10,
      }
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => envelope,
      })
      vi.stubGlobal('fetch', fetchMock)

      const result = await getTasks(1, 10)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const url = String(fetchMock.mock.calls[0][0])
      expect(url).toContain('http://localhost:3001/tasks')
      expect(url).toContain('page=1')
      expect(url).toContain('limit=10')
      expect(result).toEqual(envelope)
      expect(result.data[0].title).toBe('Write proposal')
    })
  })
  ```
- Why it fails: `lib/api.ts` does not exist yet, so the `import { getTasks }` resolves to nothing and the call throws.

## GREEN
- Smallest change: Create `lib/api.ts` exporting a `Task` type (id, title, description, status, userId, createdAt, updatedAt), a `Paginated<T>` type, and an async `getTasks(page = 1, limit = 10)` that fetches `${process.env.NEXT_PUBLIC_API_URL}/tasks?page=${page}&limit=${limit}` with `{ cache: 'no-store' }`, throws if `!res.ok`, and returns `res.json()`.
- Files touched: `lib/api.ts`

## REFACTOR
Extract a small `apiUrl(path)` helper for building URLs from the base env var — reused by `getTask` in the next cycle.
