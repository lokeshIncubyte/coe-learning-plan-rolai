import type { ChangeEvent } from 'react'
import { clampDimension } from '../model/clampDimension'

type ControlsProps = {
  width?: number
  height?: number
  grayscale?: boolean
  blur?: boolean
  blurAmount?: number
  onWidthChange: (width: number) => void
  onHeightChange?: (height: number) => void
  onGrayscaleChange?: (enabled: boolean) => void
  onBlurChange?: (enabled: boolean) => void
  onBlurAmountChange?: (amount: number) => void
}

export function Controls({
  width,
  height,
  grayscale,
  blur,
  blurAmount,
  onWidthChange,
  onHeightChange,
  onGrayscaleChange,
  onBlurChange,
  onBlurAmountChange,
}: ControlsProps) {
  const handleWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    onWidthChange(clampDimension(value))
  }

  const handleHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    onHeightChange?.(clampDimension(value))
  }

  const handleGrayscaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onGrayscaleChange?.(event.target.checked)
  }

  const handleBlurChange = (event: ChangeEvent<HTMLInputElement>) => {
    onBlurChange?.(event.target.checked)
  }

  const handleBlurAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    onBlurAmountChange?.(Number(event.target.value))
  }

  return (
    <>
      <label htmlFor="width-input">
        Width
        <input
          id="width-input"
          name="width"
          type="number"
          min={1}
          value={width}
          onChange={handleWidthChange}
        />
      </label>
      <label htmlFor="height-input">
        Height
        <input
          id="height-input"
          name="height"
          type="number"
          min={1}
          value={height}
          onChange={handleHeightChange}
        />
      </label>
      <label htmlFor="grayscale-input">
        Grayscale
        <input
          id="grayscale-input"
          name="grayscale"
          type="checkbox"
          checked={grayscale ?? false}
          onChange={handleGrayscaleChange}
        />
      </label>
      <label htmlFor="blur-input">
        Blur
        <input
          id="blur-input"
          name="blur"
          type="checkbox"
          checked={blur ?? false}
          onChange={handleBlurChange}
        />
      </label>
      {blur && (
        <label htmlFor="blur-amount-input">
          Blur amount
          <input
            id="blur-amount-input"
            name="blur-amount"
            type="range"
            min={1}
            max={10}
            value={blurAmount ?? 1}
            onChange={handleBlurAmountChange}
          />
        </label>
      )}
    </>
  )
}
