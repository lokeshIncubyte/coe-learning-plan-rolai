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
    <main>
      <TaskDetail task={task} />
      <Link href={`/tasks/${task.id}/edit`}>Edit</Link>
      <DeleteTaskControl id={task.id} />
      <Link href="/tasks">Back to tasks</Link>
    </main>
  )
}
