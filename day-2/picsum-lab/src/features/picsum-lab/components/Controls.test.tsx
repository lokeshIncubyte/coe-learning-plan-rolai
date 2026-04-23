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

  it('calls onHeightChange with numeric value when height input changes', async () => {
    const user = userEvent.setup()
    const onHeightChange = vi.fn()

    render(<Controls onWidthChange={vi.fn()} onHeightChange={onHeightChange} />)

    const heightInput = screen.getByLabelText(/height/i)
    await user.clear(heightInput)
    await user.type(heightInput, '480')

    expect(onHeightChange).toHaveBeenCalledWith(480)
  })

  it('calls onGrayscaleChange with boolean when grayscale checkbox is toggled', async () => {
    const user = userEvent.setup()
    const onGrayscaleChange = vi.fn()

    render(<Controls onWidthChange={vi.fn()} onGrayscaleChange={onGrayscaleChange} />)

    const grayscaleCheckbox = screen.getByRole('checkbox', { name: /grayscale/i })
    await user.click(grayscaleCheckbox)

    expect(onGrayscaleChange).toHaveBeenCalledWith(true)
  })

  it('calls onBlurChange with boolean when blur checkbox is toggled', async () => {
    const user = userEvent.setup()
    const onBlurChange = vi.fn()

    render(
      <Controls
        onWidthChange={vi.fn()}
        {...({ onBlurChange } as unknown as Record<string, unknown>)}
      />,
    )

    const blurCheckbox = screen.getByRole('checkbox', { name: /blur/i })
    await user.click(blurCheckbox)

    expect(onBlurChange).toHaveBeenCalledWith(true)
  })
})
