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

export async function getTasks(page = 1, limit = 10): Promise<Paginated<Task>> {
  const res = await fetch(apiUrl(`/tasks?page=${page}&limit=${limit}`), {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.status}`)
  }
  return res.json()
}

export async function getTask(id: string): Promise<Task | null> {
  const res = await fetch(apiUrl(`/tasks/${id}`), {
    cache: 'no-store',
  })
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch task: ${res.status}`)
  }
  return res.json()
}
