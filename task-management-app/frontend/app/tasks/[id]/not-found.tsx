import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <h2>Task not found</h2>
      <p>The task you are looking for does not exist.</p>
      <Link href="/tasks">Back to tasks</Link>
    </main>
  )
}
