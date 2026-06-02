import Link from 'next/link'
import { NewTaskForm } from '@/components/NewTaskForm'

export default function NewTaskPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New task</h1>
      <NewTaskForm />
      <Link
        href="/tasks"
        className="mt-6 inline-block text-sm text-gray-600 hover:text-foreground dark:text-gray-400"
      >
        Back to tasks
      </Link>
    </main>
  )
}
