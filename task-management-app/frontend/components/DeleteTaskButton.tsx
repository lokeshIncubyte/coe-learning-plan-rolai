'use client'

import { useState } from 'react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

export function DeleteTaskButton({ onConfirm }: { onConfirm: () => void | Promise<void> }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div>
        <span>Delete this task?</span>
        <button
          type="button"
          onClick={() => onConfirm()}
          className={`text-red-600 ${focusRing} focus-visible:ring-red-500`}
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className={`${focusRing} focus-visible:ring-gray-400`}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      aria-label="Delete task"
      onClick={() => setConfirming(true)}
      className={`text-red-600 ${focusRing} focus-visible:ring-red-500`}
    >
      Delete
    </button>
  )
}
