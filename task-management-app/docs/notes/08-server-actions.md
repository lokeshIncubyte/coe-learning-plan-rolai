# 8. Server Actions — and why this project used client fetch instead

## What Server Actions are

A **Server Action** is a function marked `'use server'` that runs on the server but can be called directly from a Client Component or passed as a `<form action={...}>` prop. Next.js serialises the arguments, sends them to the server via a POST, runs the function, and returns the result — all without you writing an API route.

Typical pattern:

```tsx
// app/tasks/actions.ts
'use server'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  await db.task.create({ data: { title } })
  revalidatePath('/tasks')
}

// In a Client Component:
<form action={createTask}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
```

After the action runs, `revalidatePath` tells Next.js to re-fetch and re-render the affected route segment so the listing updates automatically.

## Why this project used client fetch instead

This project talks to a **separate NestJS backend** running on `http://localhost:3001`. Server Actions are designed to run your own server-side code in the same Next.js process — they are not a proxy layer for an external API.

The chosen approach is a straightforward client-side `fetch` helper in `lib/api.ts`:

```ts
export async function createTask(input: CreateTaskInput): Promise<Task> {
  return sendTaskJson('/tasks', 'POST', input, 'Failed to create task')
}
```

`sendTaskJson` attaches the JWT from `localStorage` via `authHeaders()`, sends JSON, and throws an `Error` with the backend's message if the response is not OK. After a successful mutation the Client Component calls `router.refresh()` to re-run the server render and update the page:

```tsx
// components/NewTaskForm.tsx
const task = await createTask({ title, description, status })
toast.success('Task created')
router.push(`/tasks/${task.id}`)
router.refresh()
```

`router.refresh()` is the client-fetch equivalent of `revalidatePath`: it re-fetches the current route's server data without a full navigation.

## When you would reach for Server Actions

- The Next.js app **is** the backend (e.g. using Prisma directly in the action).
- You want progressive enhancement — the form must work without JavaScript.
- You want `revalidatePath` / `revalidateTag` cache invalidation in the same call rather than `router.refresh()`.

For a decoupled frontend + backend architecture like this one, a typed `fetch` helper is simpler and gives you full control over request headers (including auth tokens stored in the browser).
