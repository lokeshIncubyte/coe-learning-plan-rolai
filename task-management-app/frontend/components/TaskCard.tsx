import Link from 'next/link'
import type { Task } from '@/lib/api'
import { StatusBadge } from './StatusBadge'

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <span>{task.title}</span>
      <StatusBadge status={task.status} />
    </Link>
  )
}
