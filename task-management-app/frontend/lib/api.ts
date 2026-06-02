import { getToken, clearToken } from './auth'

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE'

export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  userId: string | null
  createdAt: string
  updatedAt: string
}

export type Paginated<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}

function apiUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
}

function authHeaders(): Record<string, string> {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function getTasks(page = 1, limit = 10): Promise<Paginated<Task>> {
  const res = await fetch(apiUrl(`/tasks?page=${page}&limit=${limit}`), {
    cache: 'no-store',
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    if (res.status === 401) clearToken()
    throw new Error(`Failed to fetch tasks: ${res.status}`)
  }
  return res.json()
}

export type CreateTaskInput = {
  title: string
  description?: string | null
  status: TaskStatus
}

export type UpdateTaskInput = Partial<CreateTaskInput>

async function sendTaskJson(
  path: string,
  method: 'POST' | 'PATCH',
  input: CreateTaskInput | UpdateTaskInput,
  fallbackMessage: string,
): Promise<Task> {
  const res = await fetch(apiUrl(path), {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const raw = body?.message
    const message = Array.isArray(raw)
      ? raw.join(', ')
      : typeof raw === 'string'
        ? raw
        : `${fallbackMessage}: ${res.status}`
    throw new Error(message)
  }
  return res.json()
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return sendTaskJson('/tasks', 'POST', input, 'Failed to create task')
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  return sendTaskJson(`/tasks/${id}`, 'PATCH', input, 'Failed to update task')
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/tasks/${id}`), {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (res.ok || res.status === 404) {
    return
  }
  throw new Error(`Failed to delete task: ${res.status}`)
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? 'Login failed')
  }
  return (await res.json()).access_token
}

export type AuthUser = {
  id: string
  email: string
}

export async function getMe(): Promise<AuthUser | null> {
  const t = getToken()
  if (!t) return null
  const res = await fetch(apiUrl('/auth/me'), {
    cache: 'no-store',
    headers: { ...authHeaders() },
  })
  if (res.status === 401) {
    clearToken()
    return null
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch current user: ${res.status}`)
  }
  return res.json()
}

export async function getTask(id: string): Promise<Task | null> {
  const res = await fetch(apiUrl(`/tasks/${id}`), {
    cache: 'no-store',
    headers: { ...authHeaders() },
  })
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch task: ${res.status}`)
  }
  return res.json()
}
