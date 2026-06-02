'use client'

import Link from 'next/link'

export function AuthNav({
  email,
  onLogout,
}: {
  email: string | null
  onLogout: () => void
}) {
  if (email === null) {
    return <Link href="/login">Login</Link>
  }

  return (
    <>
      <span>{email}</span>
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </>
  )
}
