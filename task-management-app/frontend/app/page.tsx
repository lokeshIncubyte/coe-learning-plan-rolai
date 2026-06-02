import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        Task Management
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        View and manage your tasks.
      </p>
      <Link
        href="/tasks"
        className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-colors hover:opacity-90"
      >
        View Tasks
      </Link>
    </main>
  );
}
