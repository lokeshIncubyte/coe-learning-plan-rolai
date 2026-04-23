import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Preview } from './Preview'

describe('Preview', () => {
  it('renders an image with provided URL', () => {
    const url = 'https://picsum.photos/id/0/400/300'

    render(<Preview url={url} />)

    expect(screen.getByRole('img')).toHaveAttribute('src', url)
  })
})
