'use client'

import type { TaskStatus } from '../lib/api'

const LABELS: Record<TaskStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const BASE = 'inline-block rounded-full px-2 py-0.5 text-xs font-medium'

const CLASSES: Record<TaskStatus, string> = {
  OPEN: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  DONE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span key={status} className={`${BASE} ${CLASSES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
