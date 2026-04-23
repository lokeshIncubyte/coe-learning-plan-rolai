import type { ChangeEvent } from 'react'
import { clampDimension } from '../model/clampDimension'

type ControlsProps = {
  onWidthChange: (width: number) => void
  onHeightChange?: (height: number) => void
}

export function Controls({ onWidthChange, onHeightChange }: ControlsProps) {
  const handleWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    onWidthChange(clampDimension(value))
  }

  const handleHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    onHeightChange?.(clampDimension(value))
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
    </>
  )
}
