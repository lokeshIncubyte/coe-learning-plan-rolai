'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteTask } from '@/lib/api'
import { useToast } from './ToastProvider'
import { DeleteTaskButton } from './DeleteTaskButton'

export function DeleteTaskControl({ id }: { id: string }) {
  const router = useRouter()
  const toast = useToast()
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setError(null)
    try {
      await deleteTask(id)
      toast.success('Task deleted')
      router.push('/tasks')
      router.refresh()
    } catch {
      const message = "Couldn't delete the task. Please try again."
      setError(message)
      toast.error(message)
    }
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <DeleteTaskButton onConfirm={handleConfirm} />
    </div>
  )
}
