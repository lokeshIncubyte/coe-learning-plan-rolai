import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Controls } from './Controls'

describe('Controls', () => {
  it('calls onWidthChange with numeric value when width input changes', async () => {
    const user = userEvent.setup()
    const onWidthChange = vi.fn()

    render(<Controls onWidthChange={onWidthChange} />)

    const widthInput = screen.getByLabelText(/width/i)
    await user.clear(widthInput)
    await user.type(widthInput, '640')

    expect(onWidthChange).toHaveBeenCalledWith(640)
  })
})
