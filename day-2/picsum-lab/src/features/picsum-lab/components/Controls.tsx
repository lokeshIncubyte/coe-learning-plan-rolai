import type { ChangeEvent } from 'react'
import { clampDimension } from '../model/clampDimension'

type ControlsProps = {
  width?: number
  height?: number
  grayscale?: boolean
  onWidthChange: (width: number) => void
  onHeightChange?: (height: number) => void
  onGrayscaleChange?: (enabled: boolean) => void
  onBlurChange?: (enabled: boolean) => void
  onRefresh?: () => void
}

export function Controls({
  width,
  height,
  grayscale,
  onWidthChange,
  onHeightChange,
  onGrayscaleChange,
  onBlurChange,
  onRefresh,
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
        <input id="blur-input" name="blur" type="checkbox" onChange={handleBlurChange} />
      </label>
      <button type="button" onClick={onRefresh}>
        Refresh
      </button>
    </>
  )
}
