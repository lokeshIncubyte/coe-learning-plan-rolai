'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { login } from '@/lib/api'
import { setToken } from '@/lib/auth'
import { LoginForm } from '@/components/LoginForm'
import { useToast } from '@/components/ToastProvider'

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()

  async function handleSubmit(email: string, password: string) {
    const token = await login(email, password)
    setToken(token)
    toast.success('Signed in')
    const next = searchParams.get('next')
    router.push(next && next.startsWith('/') ? next : '/tasks')
    router.refresh()
  }

  return (
    <main className="mx-auto w-full max-w-sm flex-1 px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Sign in</h1>
      <LoginForm onSubmit={handleSubmit} />
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  )
}
