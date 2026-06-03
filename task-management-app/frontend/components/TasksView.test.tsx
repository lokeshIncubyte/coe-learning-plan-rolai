import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TasksView } from './TasksView'
import { ToastProvider } from './ToastProvider'
import type { Task, Paginated } from '@/lib/api'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/auth', () => ({
  getToken: () => 'mock.jwt.user',
  clearToken: vi.fn(),
}))

const getTasks = vi.fn()
const deleteTask = vi.fn()
vi.mock('@/lib/api', () => ({
  getTasks: (...args: unknown[]) => getTasks(...args),
  deleteTask: (...args: unknown[]) => deleteTask(...args),
}))

const mk = (id: string, title: string): Task => ({
  id,
  title,
  description: null,
  status: 'OPEN',
  userId: null,
  createdAt: 'x',
  updatedAt: 'x',
})

function seed(tasks: Task[]) {
  const page: Paginated<Task> = { data: tasks, total: tasks.length, page: 1, limit: 10 }
  getTasks.mockResolvedValue(page)
}

function renderView() {
  return render(
    <ToastProvider>
      <TasksView />
    </ToastProvider>,
  )
}

describe('TasksView optimistic delete wiring', () => {
  beforeEach(() => {
    getTasks.mockReset()
    deleteTask.mockReset()
  })

  it('lets a user delete a task from the list with immediate removal and a success toast', async () => {
    seed([mk('t1', 'Buy milk'), mk('t2', 'Walk dog')])
    deleteTask.mockResolvedValue(undefined)
    renderView()

    const milkRow = (await screen.findByText('Buy milk')).closest('li')!
    await userEvent.click(within(milkRow).getByRole('button', { name: /delete task/i }))
    await userEvent.click(within(milkRow).getByRole('button', { name: /confirm/i }))

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
    expect(screen.getByText('Walk dog')).toBeInTheDocument()
    expect(deleteTask).toHaveBeenCalledWith('t1')
    expect(await screen.findByRole('status')).toHaveTextContent('Task deleted')
  })

  it('rolls back the row and shows an error toast when the delete fails', async () => {
    seed([mk('t1', 'Buy milk'), mk('t2', 'Walk dog')])
    let reject!: (e: Error) => void
    deleteTask.mockReturnValue(new Promise<void>((_, r) => { reject = r }))
    renderView()

    const milkRow = (await screen.findByText('Buy milk')).closest('li')!
    await userEvent.click(within(milkRow).getByRole('button', { name: /delete task/i }))
    await userEvent.click(within(milkRow).getByRole('button', { name: /confirm/i }))

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()

    reject(new Error('network'))

    expect(await screen.findByText('Buy milk')).toBeInTheDocument()
    const alerts = await screen.findAllByRole('alert')
    expect(alerts.some((a) => /couldn't delete the task/i.test(a.textContent ?? ''))).toBe(true)
  })
})
