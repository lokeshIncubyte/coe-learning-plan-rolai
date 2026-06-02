import { TaskListSkeleton } from '@/components/TaskListSkeleton'

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <TaskListSkeleton />
    </main>
  )
}
