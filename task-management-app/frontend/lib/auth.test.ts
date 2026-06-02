import { describe, it, expect, beforeEach } from 'vitest'
import { setToken, getToken, clearToken } from './auth'

describe('auth token storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull()
  })

  it('persists a token that getToken can read back', () => {
    setToken('mock.jwt.abc')
    expect(getToken()).toBe('mock.jwt.abc')
    expect(localStorage.getItem('access_token')).toBe('mock.jwt.abc')
  })

  it('clearToken removes the stored token', () => {
    setToken('mock.jwt.abc')
    clearToken()
    expect(getToken()).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
  })
})
