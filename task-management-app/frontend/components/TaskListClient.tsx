'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Task } from '@/lib/api'
import { DeleteTaskButton } from './DeleteTaskButton'
import { TaskCard } from './TaskCard'
import { TASK_GRID_CLASS } from './TaskList'

export function TaskListClient({
  tasks,
  deleteTask,
  onSuccess,
  onError,
}: {
  tasks: Task[]
  deleteTask: (id: string) => Promise<void>
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}) {
  const [items, setItems] = useState<Task[]>(tasks)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    const previous = items
    setError(null)
    setItems((current) => current.filter((t) => t.id !== id))
    try {
      await deleteTask(id)
      onSuccess?.('Task deleted')
    } catch {
      setItems(previous)
      setError("Couldn't delete the task. Please try again.")
      onError?.("Couldn't delete the task. Please try again.")
    }
  }

  if (items.length === 0) {
    return (
      <div>
        {error && <p role="alert">{error}</p>}
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <h2 className="text-lg font-medium text-gray-700">No tasks yet</h2>
          <Link
            href="/tasks/new"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Create your first task
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <ul className={TASK_GRID_CLASS}>
        {items.map((task) => (
          <li key={task.id} className="relative">
            <TaskCard task={task} />
            <div className="mt-2 flex justify-end">
              <DeleteTaskButton onConfirm={() => handleDelete(task.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
