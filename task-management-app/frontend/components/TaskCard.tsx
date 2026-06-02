import Link from 'next/link'
import type { Task } from '@/lib/api'
import { StatusBadge } from './StatusBadge'

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block w-full rounded-lg border border-gray-200 p-4 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      <span className="mb-2 block break-words font-medium">{task.title}</span>
      <StatusBadge status={task.status} />
    </Link>
  )
}
