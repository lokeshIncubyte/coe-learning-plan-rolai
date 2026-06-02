import { getTasks } from '@/lib/api'
import { TaskList } from '@/components/TaskList'

export default async function TasksPage() {
  const { data } = await getTasks()
  return (
    <main>
      <h1>Tasks</h1>
      <TaskList tasks={data} />
    </main>
  )
}
