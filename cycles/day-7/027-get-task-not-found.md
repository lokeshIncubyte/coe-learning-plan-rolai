---
id: cycle-027
slug: get-task-not-found
status: pending
source: "§4 getTask(id) helper; §5 Handle the task-not-found case (404)"
covers: error-path
---

## Behavior
`getTask(id)` in `lib/api.ts` calls `GET ${NEXT_PUBLIC_API_URL}/tasks/:id`. On a 200 it returns the parsed `Task`. On a 404 it returns `null` (so the page can call `notFound()`), rather than throwing. Any other non-ok status throws an error so it surfaces in the error boundary.

## RED
- Test file: `/home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts`
- Assertion:
  ```ts
  import { getTask } from './api'

  describe('getTask', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
    })
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('returns the task on 200', async () => {
      const task = { id: 'task-0001', title: 'T', description: 'd', status: 'OPEN', userId: null, createdAt: 'x', updatedAt: 'x' }
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => task })
      vi.stubGlobal('fetch', fetchMock)

      const result = await getTask('task-0001')

      expect(String(fetchMock.mock.calls[0][0])).toContain('http://localhost:3001/tasks/task-0001')
      expect(result).toEqual(task)
    })

    it('returns null on 404', async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })
      vi.stubGlobal('fetch', fetchMock)

      const result = await getTask('missing')

      expect(result).toBeNull()
    })
  })
  ```
- Why it fails: `getTask` is not exported from `lib/api.ts` yet (only `getTasks` exists after cycle-026), so the import is undefined and the call throws.

## GREEN
- Smallest change: Add `getTask(id)` to `lib/api.ts`: fetch `${base}/tasks/${id}` with `{ cache: 'no-store' }`; if `res.status === 404` return `null`; if `!res.ok` throw; otherwise return `res.json()` typed as `Task`. Return type `Promise<Task | null>`.
- Files touched: `lib/api.ts`

## REFACTOR
none
