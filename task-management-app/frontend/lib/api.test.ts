import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTasks, getTask, createTask, updateTask, deleteTask } from './api'

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
})

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
