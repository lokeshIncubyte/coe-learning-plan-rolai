import type { ChangeEvent } from 'react'
import { clampDimension } from '../model/clampDimension'

type ControlsProps = {
  onWidthChange: (width: number) => void
  onHeightChange?: (height: number) => void
  onGrayscaleChange?: (enabled: boolean) => void
}

export function Controls({ onWidthChange, onHeightChange, onGrayscaleChange }: ControlsProps) {
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

  return (
    <>
      <label htmlFor="width-input">
        Width
        <input id="width-input" name="width" type="number" min={1} onChange={handleWidthChange} />
      </label>
      <label htmlFor="height-input">
        Height
        <input id="height-input" name="height" type="number" min={1} onChange={handleHeightChange} />
      </label>
      <label htmlFor="grayscale-input">
        Grayscale
        <input id="grayscale-input" name="grayscale" type="checkbox" onChange={handleGrayscaleChange} />
      </label>
    </>
  )
}
