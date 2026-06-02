import Link from 'next/link'
import { getTasks } from '@/lib/api'
import { TaskList } from '@/components/TaskList'

export default async function TasksPage() {
  const { data } = await getTasks()
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
      <TaskList tasks={data} />
    </main>
  )
}
