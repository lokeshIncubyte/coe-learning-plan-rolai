import Link from 'next/link'
import { getTasks } from '@/lib/api'
import { TaskList } from '@/components/TaskList'

export default async function TasksPage() {
  const { data } = await getTasks()
  return (
    <main>
      <h1>Tasks</h1>
      <Link href="/tasks/new">New task</Link>
      <TaskList tasks={data} />
    </main>
  )
}
