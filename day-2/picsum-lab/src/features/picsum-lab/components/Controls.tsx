import type { ChangeEvent } from 'react'

type ControlsProps = {
  onWidthChange: (width: number) => void
  onHeightChange?: (height: number) => void
}

const MIN_DIMENSION = 1

export function Controls({ onWidthChange, onHeightChange }: ControlsProps) {
  const handleWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    const safeValue = Number.isFinite(value) ? Math.max(MIN_DIMENSION, value) : MIN_DIMENSION
    onWidthChange(safeValue)
  }

  const handleHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    const safeValue = Number.isFinite(value) ? Math.max(MIN_DIMENSION, value) : MIN_DIMENSION
    onHeightChange?.(safeValue)
  }

  return (
    <>
      <label htmlFor="width-input">
        Width
        <input id="width-input" name="width" type="number" min={MIN_DIMENSION} onChange={handleWidthChange} />
      </label>
      <label htmlFor="height-input">
        Height
        <input id="height-input" name="height" type="number" min={MIN_DIMENSION} onChange={handleHeightChange} />
      </label>
    </>
  )
}
