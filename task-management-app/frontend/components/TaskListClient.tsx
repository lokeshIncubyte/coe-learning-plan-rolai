'use client'

import { useState } from 'react'
import type { Task } from '@/lib/api'
import { DeleteTaskButton } from './DeleteTaskButton'

export function TaskListClient({
  tasks,
  deleteTask,
}: {
  tasks: Task[]
  deleteTask: (id: string) => Promise<void>
}) {
  const [items, setItems] = useState<Task[]>(tasks)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    const previous = items
    setError(null)
    setItems((current) => current.filter((t) => t.id !== id))
    try {
      await deleteTask(id)
    } catch {
      setItems(previous)
      setError("Couldn't delete the task. Please try again.")
    }
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <ul>
        {items.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span>
            <DeleteTaskButton onConfirm={() => handleDelete(task.id)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
