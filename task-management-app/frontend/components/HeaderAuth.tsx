'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getMe } from '@/lib/api'
import { getToken, clearToken } from '@/lib/auth'
import { AuthNav } from './AuthNav'

export function HeaderAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (!getToken()) {
      setEmail(null)
      return
    }
    getMe()
      .then((user) => {
        if (active) setEmail(user?.email ?? null)
      })
      .catch(() => {
        if (active) setEmail(null)
      })
    return () => {
      active = false
    }
  }, [pathname])

  function handleLogout() {
    clearToken()
    setEmail(null)
    router.push('/login')
    router.refresh()
  }

  return <AuthNav email={email} onLogout={handleLogout} />
}
