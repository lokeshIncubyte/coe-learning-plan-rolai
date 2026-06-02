'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getTask, type Task } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { EditTaskForm } from './EditTaskForm'

export function EditTaskView({ id }: { id: string }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=/tasks/${id}/edit`)
      return
    }
    let active = true
    getTask(id)
      .then((found) => {
        if (!active) return
        if (!found) {
          setStatus('not-found')
          return
        }
        setTask(found)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (!active) return
        if (!getToken()) {
          router.replace(`/login?next=/tasks/${id}/edit`)
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to load task')
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [id, router])

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit task</h1>
      {status === 'loading' && <p className="text-sm text-gray-500">Loading…</p>}
      {status === 'not-found' && (
        <p className="text-sm text-gray-700 dark:text-gray-300">Task not found.</p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {status === 'ready' && task && <EditTaskForm task={task} />}
      <Link
        href={status === 'ready' && task ? `/tasks/${task.id}` : '/tasks'}
        className="mt-6 inline-block text-sm text-gray-600 hover:text-foreground dark:text-gray-400"
      >
        Cancel
      </Link>
    </main>
  )
}
