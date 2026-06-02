import type { Task } from '../lib/api'
import { StatusBadge } from './StatusBadge'

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

export function TaskDetail({ task }: { task: Task }) {
  return (
    <article className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight break-words">
          {task.title}
        </h1>
        <StatusBadge status={task.status} />
      </div>
      {task.description && (
        <p className="mb-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {task.description}
        </p>
      )}
      <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
        <p>Created: {formatDate(task.createdAt)}</p>
        <p>Updated: {formatDate(task.updatedAt)}</p>
      </div>
    </article>
  )
}
