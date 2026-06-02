import Link from 'next/link'

export function SiteHeader() {
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/tasks">Tasks</Link>
      </nav>
    </header>
  )
}
