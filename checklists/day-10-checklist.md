# Day 10 Checklist — Authentication Basics & Deployment (Project Completion)

**Project:** Task Management App — add security and deploy
**Reference:** [`next.md`](../next.md), NestJS Authentication docs, JWT, Next.js auth patterns, Vercel
**Directories:** backend `day-3/task-management-backend/`, frontend `day-7/task-management-frontend/`

---

## 1. Learn — concepts before code
- [x] JWT authentication basics: structure (header.payload.signature), signing, expiry, verification → [`notes/16-jwt.md`]
- [x] Password hashing with bcrypt: salting, why never store plaintext → [`notes/17-bcrypt.md`]
- [x] NestJS auth: `@nestjs/passport`, `@nestjs/jwt`, strategies, `AuthGuard` → [`notes/18-nestjs-auth.md`]
- [x] Guards and protecting routes; reading the user off the request → absorb into note 18
- [x] Next.js authentication patterns: storing tokens, attaching them to API calls, protecting routes → [`notes/19-nextjs-auth.md`]
- [x] Deployment basics: Vercel (frontend) + Railway/Render (backend) + env vars → [`notes/20-deployment.md`]

## 2. Backend — auth foundation
- [x] Install `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
- [x] Add `password` (hashed) to the `User` model + migration
- [x] `AuthModule` / `AuthService` — register (hash with bcrypt) and validate credentials
- [x] `POST /auth/register` — create a user with a hashed password
- [x] `POST /auth/login` — verify password, return a signed JWT
- [x] Configure `JwtModule` with secret from env (`JWT_SECRET`) and an expiry

## 3. Backend — protect routes
- [x] Implement `JwtStrategy` + `JwtAuthGuard`
- [x] Protect the task routes (`POST/PATCH/DELETE /tasks`, optionally `GET`) with the guard
- [ ] Scope tasks to the authenticated user (`userId` from the token) where appropriate
- [x] Unauthenticated requests to protected routes return 401

## 4. Frontend — login flow
- [x] `app/login/page.tsx` — login form (Client Component)
- [x] Submit → `POST /auth/login`; store the JWT securely (httpOnly cookie preferred, or document the localStorage trade-off)
- [x] Attach the token to API requests in `lib/api.ts` (Authorization: Bearer)
- [x] `app/register/page.tsx` (optional) — registration form
- [x] Logout clears the token and redirects

## 5. Frontend — protected routes
- [x] Redirect unauthenticated users away from task pages (middleware or per-page check)
- [x] Show auth state in the header (logged-in user / logout button)
- [x] Handle 401 from the API (token expired → redirect to login)

## 6. Verify — auth flow
- [x] Register a user → password stored hashed in the DB (not plaintext)
- [x] Login → receives a JWT; protected calls succeed with it
- [x] Protected call without a token → 401
- [x] Frontend redirects unauthenticated users to `/login`
- [x] Logout → can no longer reach protected pages

## 7. Deploy
- [ ] Deploy the backend (Railway/Render) with `DATABASE_URL` + `JWT_SECRET` env vars; run migrations
- [ ] Deploy the frontend to Vercel with `NEXT_PUBLIC_API_URL` pointing at the deployed backend
- [ ] CORS configured on the backend to allow the deployed frontend origin
- [ ] Smoke test the deployed app end-to-end (register → login → CRUD)

## 8. Document & Ship
- [x] Create deployment documentation (`docs/deployment.md`) — env vars, steps, URLs
- [ ] `README.md` updated with live URLs and auth/setup instructions
- [x] Final commit and push

---

## Success Criteria (from next.md)
- [x] JWT authentication implemented in the backend
- [x] Passwords hashed with bcrypt
- [x] API routes protected with guards
- [x] Login page created in the frontend
- [x] JWT stored securely
- [x] Protected routes implemented
- [x] Auth flow works end-to-end in the Task Management app
- [x] Deployment guide created
- [ ] Task Management App is complete (deployed and functional)
