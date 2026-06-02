'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { NewTaskForm } from './NewTaskForm'

export function NewTaskView() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/tasks/new')
      return
    }
    setAuthed(true)
  }, [router])

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New task</h1>
      {authed && <NewTaskForm />}
      <Link
        href="/tasks"
        className="mt-6 inline-block text-sm text-gray-600 hover:text-foreground dark:text-gray-400"
      >
        Back to tasks
      </Link>
    </main>
  )
}
