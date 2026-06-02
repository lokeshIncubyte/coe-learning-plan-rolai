import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ToastProvider, useToast } from './ToastProvider'

function Trigger() {
  const toast = useToast()
  return (
    <div>
      <button onClick={() => toast.success('Task created')}>ok</button>
      <button onClick={() => toast.error("Couldn't save task")}>fail</button>
    </div>
  )
}

describe('ToastProvider', () => {
  it('shows a success toast in a status region and can dismiss it', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'ok' }))
    const toast = screen.getByText('Task created')
    expect(toast).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Task created')

    await userEvent.click(screen.getByRole('button', { name: /dismiss|close/i }))
    expect(screen.queryByText('Task created')).not.toBeInTheDocument()
  })

  it('shows a failure toast in an alert region', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'fail' }))
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't save task")
  })
})
