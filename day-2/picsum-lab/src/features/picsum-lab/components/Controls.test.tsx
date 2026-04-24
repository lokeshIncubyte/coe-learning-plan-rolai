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

  it('renders the provided height value on the height input', () => {
    render(<Controls onWidthChange={vi.fn()} height={512} />)

    expect(screen.getByLabelText(/height/i)).toHaveValue(512)
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

  it('reflects the grayscale prop on the grayscale checkbox', () => {
    render(<Controls onWidthChange={vi.fn()} grayscale={true} />)

    expect(screen.getByRole('checkbox', { name: /grayscale/i })).toBeChecked()
  })

  it('calls onGrayscaleChange with boolean when grayscale checkbox is toggled', async () => {
    const user = userEvent.setup()
    const onGrayscaleChange = vi.fn()

    render(<Controls onWidthChange={vi.fn()} onGrayscaleChange={onGrayscaleChange} />)

    const grayscaleCheckbox = screen.getByRole('checkbox', { name: /grayscale/i })
    await user.click(grayscaleCheckbox)

    expect(onGrayscaleChange).toHaveBeenCalledWith(true)
  })

  it('reflects the blur prop on the blur checkbox', () => {
    render(<Controls onWidthChange={vi.fn()} blur={true} />)

    expect(screen.getByRole('checkbox', { name: /blur/i })).toBeChecked()
  })

  it('calls onBlurChange with boolean when blur checkbox is toggled', async () => {
    const user = userEvent.setup()
    const onBlurChange = vi.fn()

    render(<Controls onWidthChange={vi.fn()} onBlurChange={onBlurChange} />)

    const blurCheckbox = screen.getByRole('checkbox', { name: /blur/i })
    await user.click(blurCheckbox)

    expect(onBlurChange).toHaveBeenCalledWith(true)
  })

  it('calls onRefresh when refresh button is clicked', async () => {
    const user = userEvent.setup()
    const onRefresh = vi.fn()

    render(<Controls onWidthChange={vi.fn()} onRefresh={onRefresh} />)

    await user.click(screen.getByRole('button', { name: /refresh/i }))

    expect(onRefresh).toHaveBeenCalledTimes(1)
  })
})
