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
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Title is required')
      return
    }
    setError('')
    setPending(true)
    try {
      await onSubmit({ title: trimmed, description: description.trim(), status })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setPending(false)
    }
  }

  const fieldClass =
    'w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700'
  const labelClass = 'mb-1 block text-sm font-medium'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className={labelClass}>
          Title
        </label>
        <input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="task-description" className={labelClass}>
          Description
        </label>
        <input
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="task-status" className={labelClass}>
          Status
        </label>
        <select
          id="task-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className={fieldClass}
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
