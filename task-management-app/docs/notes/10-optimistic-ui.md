# 10. Optimistic UI updates with rollback

## What it is

An **optimistic UI update** applies a change to local state *immediately* — before the network request has completed — so the interface feels instant. If the request succeeds, nothing more needs to happen; the local state already reflects reality. If the request fails, the update is **rolled back** and an error is shown.

The pattern trades a small risk of a brief flicker (rollback) for a dramatically faster perceived response. It works best for destructive or low-risk actions where failure is uncommon.

## The general shape

```
1. Snapshot the current state         → const previous = items
2. Apply the change immediately       → setItems(optimistic version)
3. Await the network request
4. On success  → nothing; local state is already correct
5. On failure  → setItems(previous); show error message
```

## How it is used in this project

`components/TaskListClient.tsx` implements optimistic delete. The full handler:

```tsx
async function handleDelete(id: string) {
  const previous = items                          // 1. snapshot
  setError(null)
  setItems((current) => current.filter((t) => t.id !== id))  // 2. remove immediately

  try {
    await deleteTask(id)                          // 3. real network call
    onSuccess?.('Task deleted')                   // 4. success — no state change needed
  } catch {
    setItems(previous)                            // 5a. rollback
    setError("Couldn't delete the task. Please try again.")
    onError?.("Couldn't delete the task. Please try again.")
  }
}
```

From the user's perspective the row disappears the instant they confirm. If the network call fails — say the backend is down — the row reappears and an error banner is rendered:

```tsx
{error && <p role="alert">{error}</p>}
```

### Why `const previous = items` works

`items` is a React state array. Capturing it in `previous` before calling `setItems` gives you a stable reference to the pre-mutation snapshot. Because arrays are reference types, you must capture before the `setItems` call — after it, `items` inside the closure is still the old value (closures capture the reference at call time), but saving it explicitly makes the intent clear and guards against future refactors.

### `useOptimistic` — the React 19 alternative

React 19 ships a `useOptimistic` hook that formalises this pattern:

```tsx
const [optimisticItems, removeOptimistic] = useOptimistic(
  items,
  (state, id: string) => state.filter((t) => t.id !== id),
)
```

`useOptimistic` automatically reverts to the source-of-truth state when the enclosing async transition settles. The manual snapshot-and-rollback approach in this project is equivalent and works on older React versions too.
