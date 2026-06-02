'use client'

import { useRouter } from 'next/navigation'
import { createTask } from '@/lib/api'
import { TaskForm, type TaskFormValues } from './TaskForm'

export function NewTaskForm() {
  const router = useRouter()

  async function handleSubmit(values: TaskFormValues) {
    const task = await createTask({
      title: values.title,
      description: values.description,
      status: values.status,
    })
    router.push(`/tasks/${task.id}`)
    router.refresh()
  }

  return <TaskForm onSubmit={handleSubmit} submitLabel="Create task" />
}
