import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskListClient } from './TaskListClient'
import type { Task } from '@/lib/api'

const tasks: Task[] = [
  { id: 't1', title: 'Buy milk', description: null, status: 'OPEN', userId: null, createdAt: 'x', updatedAt: 'x' },
  { id: 't2', title: 'Walk dog', description: null, status: 'OPEN', userId: null, createdAt: 'x', updatedAt: 'x' },
]

describe('TaskListClient optimistic delete', () => {
  it('removes the row immediately then rolls back on failure', async () => {
    let reject!: (e: Error) => void
    const deleteTask = vi.fn().mockReturnValue(new Promise<void>((_, r) => { reject = r }))
    render(<TaskListClient tasks={tasks} deleteTask={deleteTask} />)

    const milkRow = screen.getByText('Buy milk').closest('li')!
    await userEvent.click(within(milkRow).getByRole('button', { name: /delete task/i }))
    await userEvent.click(within(milkRow).getByRole('button', { name: /confirm/i }))

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
    expect(screen.getByText('Walk dog')).toBeInTheDocument()

    reject(new Error('network'))
    expect(await screen.findByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText(/couldn't delete the task/i)).toBeInTheDocument()
  })
})

const toastTasks: Task[] = [
  { id: 'a', title: 'Alpha', description: null, status: 'OPEN', userId: null, createdAt: '', updatedAt: '' },
]

describe('TaskListClient delete toasts', () => {
  it('calls onSuccess after a successful delete', async () => {
    const onSuccess = vi.fn()
    render(<TaskListClient tasks={toastTasks} deleteTask={vi.fn().mockResolvedValue(undefined)} onSuccess={onSuccess} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onSuccess).toHaveBeenCalledWith('Task deleted')
  })

  it('calls onError and keeps the task when delete fails', async () => {
    const onError = vi.fn()
    render(<TaskListClient tasks={toastTasks} deleteTask={vi.fn().mockRejectedValue(new Error('boom'))} onError={onError} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onError).toHaveBeenCalledWith("Couldn't delete the task. Please try again.")
    expect(await screen.findByText('Alpha')).toBeInTheDocument()
  })
})
