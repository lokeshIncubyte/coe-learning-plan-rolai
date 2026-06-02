import { TaskDetailView } from '@/components/TaskDetailView'

export default async function TaskDetailPage({
  params,
}: PageProps<'/tasks/[id]'>) {
  const { id } = await params
  return <TaskDetailView id={id} />
}
