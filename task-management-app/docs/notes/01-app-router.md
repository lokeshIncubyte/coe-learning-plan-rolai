# 1. Next.js App Router — architecture and request lifecycle

## What it is

The **App Router** (introduced in Next.js 13, stable in 14) is a file-system-based router that lives in the `app/` directory. Every folder inside `app/` that contains a `page.tsx` becomes a publicly accessible URL. Alongside routing, the App Router is the foundation for React Server Components, streaming, and nested layouts.

Think of it as: *the file tree is the URL tree, and every node in that tree can have its own layout, loading state, and error boundary.*

## How the request lifecycle works

1. A request arrives at a URL (e.g. `/tasks/42`).
2. Next.js matches the URL to the closest route segment — `app/tasks/[id]/page.tsx`.
3. Server Components in that segment tree run on the server, fetch data, and render to HTML + a React payload.
4. The HTML is streamed to the browser; React hydrates interactivity for Client Components only.
5. Subsequent navigations are client-side: Next.js fetches only the changed segment's payload, not the whole page.

Layouts wrap their child segments. The root layout (`app/layout.tsx`) runs on every request; inner layouts run only when their subtree is active. This means the `<html>` and `<body>` are rendered once, and navigating between `/tasks` and `/tasks/42` only re-renders the leaf segment.

## How it is used in this project

The frontend lives at `task-management-app/frontend/`. The `app/` directory has this shape:

```
app/
├── layout.tsx          ← root layout: <html>, <body>, SiteHeader, ToastProvider
├── page.tsx            ← home route  /
├── login/
│   └── page.tsx        ← /login
└── tasks/
    ├── page.tsx        ← /tasks  (listing)
    ├── loading.tsx     ← shown while /tasks fetches
    ├── error.tsx       ← catches fetch errors in /tasks
    ├── new/
    │   └── page.tsx    ← /tasks/new
    └── [id]/
        ├── page.tsx    ← /tasks/:id  (detail)
        ├── not-found.tsx
        └── edit/
            └── page.tsx ← /tasks/:id/edit
```

The root layout (`app/layout.tsx`) wraps every page in the shared `<SiteHeader>` and `<ToastProvider>` — those render once and persist across navigations:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" ...>
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <SiteHeader authSlot={<HeaderAuth />} />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
```

`{children}` is replaced by the matched route segment — `app/tasks/page.tsx` for `/tasks`, `app/tasks/[id]/page.tsx` for `/tasks/42`, and so on.
