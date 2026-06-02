# Day 10 Checklist — Authentication Basics & Deployment (Project Completion)

**Project:** Task Management App — add security and deploy
**Reference:** [`next.md`](../next.md), NestJS Authentication docs, JWT, Next.js auth patterns, Vercel
**Directories:** backend `day-3/task-management-backend/`, frontend `day-7/task-management-frontend/`

---

## 1. Learn — concepts before code
- [ ] JWT authentication basics: structure (header.payload.signature), signing, expiry, verification → [`notes/16-jwt.md`]
- [ ] Password hashing with bcrypt: salting, why never store plaintext → [`notes/17-bcrypt.md`]
- [ ] NestJS auth: `@nestjs/passport`, `@nestjs/jwt`, strategies, `AuthGuard` → [`notes/18-nestjs-auth.md`]
- [ ] Guards and protecting routes; reading the user off the request → absorb into note 18
- [ ] Next.js authentication patterns: storing tokens, attaching them to API calls, protecting routes → [`notes/19-nextjs-auth.md`]
- [ ] Deployment basics: Vercel (frontend) + Railway/Render (backend) + env vars → [`notes/20-deployment.md`]

## 2. Backend — auth foundation
- [ ] Install `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
- [ ] Add `password` (hashed) to the `User` model + migration
- [ ] `AuthModule` / `AuthService` — register (hash with bcrypt) and validate credentials
- [ ] `POST /auth/register` — create a user with a hashed password
- [ ] `POST /auth/login` — verify password, return a signed JWT
- [ ] Configure `JwtModule` with secret from env (`JWT_SECRET`) and an expiry

## 3. Backend — protect routes
- [ ] Implement `JwtStrategy` + `JwtAuthGuard`
- [ ] Protect the task routes (`POST/PATCH/DELETE /tasks`, optionally `GET`) with the guard
- [ ] Scope tasks to the authenticated user (`userId` from the token) where appropriate
- [ ] Unauthenticated requests to protected routes return 401

## 4. Frontend — login flow
- [ ] `app/login/page.tsx` — login form (Client Component)
- [ ] Submit → `POST /auth/login`; store the JWT securely (httpOnly cookie preferred, or document the localStorage trade-off)
- [ ] Attach the token to API requests in `lib/api.ts` (Authorization: Bearer)
- [ ] `app/register/page.tsx` (optional) — registration form
- [ ] Logout clears the token and redirects

## 5. Frontend — protected routes
- [ ] Redirect unauthenticated users away from task pages (middleware or per-page check)
- [ ] Show auth state in the header (logged-in user / logout button)
- [ ] Handle 401 from the API (token expired → redirect to login)

## 6. Verify — auth flow
- [ ] Register a user → password stored hashed in the DB (not plaintext)
- [ ] Login → receives a JWT; protected calls succeed with it
- [ ] Protected call without a token → 401
- [ ] Frontend redirects unauthenticated users to `/login`
- [ ] Logout → can no longer reach protected pages

## 7. Deploy
- [ ] Deploy the backend (Railway/Render) with `DATABASE_URL` + `JWT_SECRET` env vars; run migrations
- [ ] Deploy the frontend to Vercel with `NEXT_PUBLIC_API_URL` pointing at the deployed backend
- [ ] CORS configured on the backend to allow the deployed frontend origin
- [ ] Smoke test the deployed app end-to-end (register → login → CRUD)

## 8. Document & Ship
- [ ] Create deployment documentation (`docs/deployment.md`) — env vars, steps, URLs
- [ ] `README.md` updated with live URLs and auth/setup instructions
- [ ] Final commit and push

---

## Success Criteria (from next.md)
- [ ] JWT authentication implemented in the backend
- [ ] Passwords hashed with bcrypt
- [ ] API routes protected with guards
- [ ] Login page created in the frontend
- [ ] JWT stored securely
- [ ] Protected routes implemented
- [ ] Auth flow works end-to-end in the Task Management app
- [ ] Deployment guide created
- [ ] Task Management App is complete (deployed and functional)
