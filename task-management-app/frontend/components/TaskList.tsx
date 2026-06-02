import Link from 'next/link'
import type { Task } from '@/lib/api'
import { TaskCard } from './TaskCard'

export const TASK_GRID_CLASS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <h2 className="text-lg font-medium text-gray-700">No tasks yet</h2>
        <Link
          href="/tasks/new"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Create your first task
        </Link>
      </div>
    )
  }
  return (
    <ul className={TASK_GRID_CLASS}>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  )
}
