'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function SiteHeader({ authSlot }: { authSlot?: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Below the `sm` breakpoint the primary nav links collapse behind
              this accessible toggle. At >= sm the toggle is hidden and the
              links show inline (see <nav> below). */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 sm:hidden dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Menu
          </button>
          <nav
            id="primary-nav"
            aria-label="Primary"
            className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full z-10 flex-col gap-2 border-b border-gray-200 bg-background px-4 py-3 sm:static sm:flex sm:flex-row sm:items-center sm:gap-4 sm:border-0 sm:bg-transparent sm:p-0 dark:border-gray-800`}
          >
            <Link
              href="/"
              className="font-semibold tracking-tight hover:opacity-80"
            >
              Home
            </Link>
            <Link
              href="/tasks"
              className="text-gray-600 hover:text-foreground dark:text-gray-400"
            >
              Tasks
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {authSlot}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
