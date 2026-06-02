import Link from 'next/link'
import { NewTaskForm } from '@/components/NewTaskForm'

export default function NewTaskPage() {
  return (
    <main>
      <h1>New task</h1>
      <NewTaskForm />
      <Link href="/tasks">Back to tasks</Link>
    </main>
  )
}
