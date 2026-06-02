'use client'

import { useRouter } from 'next/navigation'
import { updateTask, type Task } from '@/lib/api'
import { useToast } from './ToastProvider'
import { TaskForm, type TaskFormValues } from './TaskForm'

export function EditTaskForm({ task }: { task: Task }) {
  const router = useRouter()
  const toast = useToast()

  async function handleSubmit(values: TaskFormValues) {
    try {
      await updateTask(task.id, {
        title: values.title,
        description: values.description,
        status: values.status,
      })
      toast.success('Task updated')
      router.push(`/tasks/${task.id}`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    }
  }

  return (
    <TaskForm
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      initialValues={{
        title: task.title,
        description: task.description ?? '',
        status: task.status,
      }}
    />
  )
}
