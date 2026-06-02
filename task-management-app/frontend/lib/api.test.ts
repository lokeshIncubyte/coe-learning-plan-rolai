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
