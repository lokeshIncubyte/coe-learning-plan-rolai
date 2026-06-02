'use client'

import { useRouter } from 'next/navigation'
import { createTask } from '@/lib/api'
import { useToast } from './ToastProvider'
import { TaskForm, type TaskFormValues } from './TaskForm'

export function NewTaskForm() {
  const router = useRouter()
  const toast = useToast()

  async function handleSubmit(values: TaskFormValues) {
    try {
      const task = await createTask({
        title: values.title,
        description: values.description,
        status: values.status,
      })
      toast.success('Task created')
      router.push(`/tasks/${task.id}`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    }
  }

  return <TaskForm onSubmit={handleSubmit} submitLabel="Create task" />
}
