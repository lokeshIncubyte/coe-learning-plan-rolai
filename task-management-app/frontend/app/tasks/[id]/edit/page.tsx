import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTask } from '@/lib/api'
import { EditTaskForm } from '@/components/EditTaskForm'

export default async function EditTaskPage({
  params,
}: PageProps<'/tasks/[id]/edit'>) {
  const { id } = await params
  const task = await getTask(id)

  if (!task) {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit task</h1>
      <EditTaskForm task={task} />
      <Link
        href={`/tasks/${task.id}`}
        className="mt-6 inline-block text-sm text-gray-600 hover:text-foreground dark:text-gray-400"
      >
        Cancel
      </Link>
    </main>
  )
}
