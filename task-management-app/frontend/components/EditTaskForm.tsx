'use client'

import { useRouter } from 'next/navigation'
import { updateTask, type Task } from '@/lib/api'
import { TaskForm, type TaskFormValues } from './TaskForm'

export function EditTaskForm({ task }: { task: Task }) {
  const router = useRouter()

  async function handleSubmit(values: TaskFormValues) {
    await updateTask(task.id, {
      title: values.title,
      description: values.description,
      status: values.status,
    })
    router.push(`/tasks/${task.id}`)
    router.refresh()
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
