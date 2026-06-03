# 9. Form validation — client-side checks and backend error surfacing

## Two layers, two jobs

Good form validation lives in two places:

1. **Client-side** — catches obvious mistakes instantly (empty required field, too-short title) without a network round-trip. Keeps the UX fast and reduces unnecessary backend load.
2. **Backend** — the authoritative source. The server enforces business rules, uniqueness constraints, and type safety that the browser cannot be trusted to enforce. The frontend must surface whatever the backend rejects.

Never treat client-side validation as a security boundary — it's a UX convenience only.

## How it is used in this project

### Client-side: required title check in `TaskForm`

`components/TaskForm.tsx` intercepts the submit event and runs a synchronous check before touching the network:

```tsx
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const trimmed = title.trim()
  if (!trimmed) {
    setError('Title is required')
    return           // bail out — no fetch
  }
  setError('')
  setPending(true)
  try {
    await onSubmit({ title: trimmed, description: description.trim(), status })
  } catch (e) {
    setError(e instanceof Error ? e.message : String(e))
  } finally {
    setPending(false)
  }
}
```

Note `title.trim()` — the client strips whitespace so a title of `"   "` is treated as empty. The trimmed value is also what gets sent to the backend, so the server never receives leading/trailing spaces.

### Backend errors surfaced via `lib/api.ts`

`sendTaskJson` in `lib/api.ts` reads the `message` field from the response body when the backend returns a non-OK status (400 for validation failures, 409 for conflicts, etc.):

```ts
const body = await res.json().catch(() => null)
const raw = body?.message
const message = Array.isArray(raw)
  ? raw.join(', ')         // NestJS class-validator returns string[]
  : typeof raw === 'string'
    ? raw
    : `${fallbackMessage}: ${res.status}`
throw new Error(message)
```

NestJS validation pipes return `message` as a **string array** (one entry per failed rule). The `Array.isArray` branch joins them into a single human-readable string before throwing. That `Error` propagates up to `TaskForm`'s `catch` block, where it lands in `setError` and renders under the form:

```tsx
{error && (
  <p role="alert" className="text-sm text-red-600">
    {error}
  </p>
)}
```

### Pending state disables the submit button

While the request is in flight, `pending` is `true` and the button is disabled:

```tsx
<button type="submit" disabled={pending}>
  {pending ? 'Saving…' : submitLabel}
</button>
```

This prevents double-submits and gives the user clear feedback that something is happening.
