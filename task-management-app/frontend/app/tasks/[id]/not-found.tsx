import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h2 className="text-xl font-semibold">Task not found</h2>
      <p className="text-gray-600 dark:text-gray-400">
        The task you are looking for does not exist.
      </p>
      <Link
        href="/tasks"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to tasks
      </Link>
    </main>
  )
}
