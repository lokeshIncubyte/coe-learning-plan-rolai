'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteTask } from '@/lib/api'
import { DeleteTaskButton } from './DeleteTaskButton'

export function DeleteTaskControl({ id }: { id: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setError(null)
    try {
      await deleteTask(id)
      router.push('/tasks')
      router.refresh()
    } catch {
      setError("Couldn't delete the task. Please try again.")
    }
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <DeleteTaskButton onConfirm={handleConfirm} />
    </div>
  )
}
