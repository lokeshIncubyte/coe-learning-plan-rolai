'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getTask, type Task } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { TaskDetail } from './TaskDetail'
import { DeleteTaskControl } from './DeleteTaskControl'

export function TaskDetailView({ id }: { id: string }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=/tasks/${id}`)
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
          router.replace(`/login?next=/tasks/${id}`)
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      {status === 'loading' && <p className="text-sm text-gray-500">Loading…</p>}
      {status === 'not-found' && (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Task not found</h1>
          <Link
            href="/tasks"
            className="mt-4 inline-block text-sm text-gray-600 hover:text-foreground dark:text-gray-400"
          >
            Back to tasks
          </Link>
        </div>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {status === 'ready' && task && (
        <>
          <TaskDetail task={task} />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Edit
            </Link>
            <DeleteTaskControl id={task.id} />
            <Link
              href="/tasks"
              className="ml-auto text-sm text-gray-600 hover:text-foreground dark:text-gray-400"
            >
              Back to tasks
            </Link>
          </div>
        </>
      )}
    </main>
  )
}
