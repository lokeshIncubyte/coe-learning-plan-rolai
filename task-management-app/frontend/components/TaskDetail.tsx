import type { Task } from '../lib/api'
import { StatusBadge } from './StatusBadge'

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

export function TaskDetail({ task }: { task: Task }) {
  return (
    <article>
      <h1>{task.title}</h1>
      <StatusBadge status={task.status} />
      <p>{task.description}</p>
      <p>Created: {formatDate(task.createdAt)}</p>
      <p>Updated: {formatDate(task.updatedAt)}</p>
    </article>
  )
}
