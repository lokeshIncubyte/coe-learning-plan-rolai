'use client'

import { useState } from 'react'

type Status = 'OPEN' | 'IN_PROGRESS' | 'DONE'

export type TaskFormValues = {
  title: string
  description: string
  status: Status
}

type TaskFormProps = {
  onSubmit: (values: TaskFormValues) => void | Promise<void>
  submitLabel: string
  initialValues?: Partial<TaskFormValues>
}

export function TaskForm({ onSubmit, submitLabel, initialValues }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [status, setStatus] = useState<Status>(initialValues?.status ?? 'OPEN')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Title is required')
      return
    }
    setError('')
    onSubmit({ title: trimmed, description: description.trim(), status })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="task-description">Description</label>
      <input
        id="task-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="task-status">Status</label>
      <select
        id="task-status"
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
      >
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      {error && <p>{error}</p>}

      <button type="submit">{submitLabel}</button>
    </form>
  )
}
