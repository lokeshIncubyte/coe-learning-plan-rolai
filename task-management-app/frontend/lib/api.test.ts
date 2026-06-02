import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTasks, getTask } from './api'

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
