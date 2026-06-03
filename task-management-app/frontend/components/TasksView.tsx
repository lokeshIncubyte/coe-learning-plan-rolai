'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { deleteTask, getTasks, type Task } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { TaskListClient } from './TaskListClient'
import { TaskListSkeleton } from './TaskListSkeleton'
import { useToast } from './ToastProvider'

export function TasksView() {
  const router = useRouter()
  const toast = useToast()
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/tasks')
      return
    }
    let active = true
    getTasks()
      .then((res) => {
        if (active) setTasks(res.data)
      })
      .catch((err: unknown) => {
        if (!active) return
        if (!getToken()) {
          router.replace('/login?next=/tasks')
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to load tasks')
      })
    return () => {
      active = false
    }
  }, [router])

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <Link
          href="/tasks/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New task
        </Link>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : tasks === null ? (
        <TaskListSkeleton />
      ) : (
        <TaskListClient
          tasks={tasks}
          deleteTask={deleteTask}
          onSuccess={(message) => toast.success(message)}
          onError={(message) => toast.error(message)}
        />
      )}
    </main>
  )
}
