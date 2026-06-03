# 7. Controlled form inputs and local state

## What "controlled" means

A **controlled input** is one where React owns the value. You wire the input's `value` prop to a piece of state, and the `onChange` handler updates that state on every keystroke. The DOM reflects React's state — not the other way around.

```tsx
const [title, setTitle] = useState('')
<input value={title} onChange={(e) => setTitle(e.target.value)} />
```

An **uncontrolled input** lets the DOM hold the value; you read it out via a `ref` only when you need it (e.g. on submit). Next.js Server Actions often lean on uncontrolled inputs (`<form action={serverAction}>`), because the browser's native `FormData` is enough. For complex client-side validation or pre-filled edit forms, controlled inputs are easier.

## Why controlled inputs help here

- You can validate on submit before hitting the network (no round-trip for a blank title).
- You can pre-fill an edit form by seeding `useState` from the existing task.
- You can disable the submit button while the request is in flight simply by checking a `pending` state variable.

## How it is used in this project

`components/TaskForm.tsx` is the single form primitive used by both create and edit flows. It manages five pieces of local state:

```tsx
const [title, setTitle]       = useState(initialValues?.title ?? '')
const [description, setDesc]  = useState(initialValues?.description ?? '')
const [status, setStatus]     = useState<Status>(initialValues?.status ?? 'OPEN')
const [error, setError]       = useState('')
const [pending, setPending]   = useState(false)
```

Each field is fully controlled:

```tsx
<input
  id="task-title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
<select
  id="task-status"
  value={status}
  onChange={(e) => setStatus(e.target.value as Status)}
>
```

`EditTaskForm` (`components/EditTaskForm.tsx`) pre-fills the form by passing `initialValues` sourced from the fetched task:

```tsx
<TaskForm
  onSubmit={handleSubmit}
  submitLabel="Save changes"
  initialValues={{
    title: task.title,
    description: task.description ?? '',
    status: task.status,
  }}
/>
```

Because `useState` is initialised once, this works correctly: the task data is fetched by `EditTaskView`, passed down as a prop, and `TaskForm` seeds its state from it on mount.
