import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTask } from '@/lib/api'
import { TaskDetail } from '@/components/TaskDetail'
import { DeleteTaskControl } from '@/components/DeleteTaskControl'

export default async function TaskDetailPage({
  params,
}: PageProps<'/tasks/[id]'>) {
  const { id } = await params
  const task = await getTask(id)

  if (!task) {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
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
    </main>
  )
}
