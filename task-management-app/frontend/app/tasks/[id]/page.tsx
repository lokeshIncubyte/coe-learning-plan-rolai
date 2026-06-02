import { notFound } from 'next/navigation'
import { getTask } from '@/lib/api'
import { TaskDetail } from '@/components/TaskDetail'

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
    </main>
  )
}
