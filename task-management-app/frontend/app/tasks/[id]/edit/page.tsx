import { EditTaskView } from '@/components/EditTaskView'

export default async function EditTaskPage({
  params,
}: PageProps<'/tasks/[id]/edit'>) {
  const { id } = await params
  return <EditTaskView id={id} />
}
