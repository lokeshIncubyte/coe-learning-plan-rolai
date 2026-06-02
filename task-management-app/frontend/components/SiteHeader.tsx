import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <nav className="flex items-center gap-4">
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
        <ThemeToggle />
      </div>
    </header>
  )
}
