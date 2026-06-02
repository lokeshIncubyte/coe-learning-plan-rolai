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
    <main>
      <h1>Edit task</h1>
      <EditTaskForm task={task} />
      <Link href={`/tasks/${task.id}`}>Cancel</Link>
    </main>
  )
}
