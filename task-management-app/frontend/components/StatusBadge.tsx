'use client'

import type { TaskStatus } from '../lib/api'

const LABELS: Record<TaskStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span>{LABELS[status]}</span>
}
