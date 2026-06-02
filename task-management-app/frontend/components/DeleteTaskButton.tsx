'use client'

import { useState } from 'react'

export function DeleteTaskButton({ onConfirm }: { onConfirm: () => void | Promise<void> }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div>
        <span>Delete this task?</span>
        <button type="button" onClick={() => onConfirm()}>
          Confirm
        </button>
        <button type="button" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button type="button" onClick={() => setConfirming(true)}>
      Delete
    </button>
  )
}
