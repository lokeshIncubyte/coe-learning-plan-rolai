# User Stories — Day 10 (Authentication & Deployment — Project Completion)

**Project:** Task Management App (NestJS backend + Next.js frontend)
**Scope:** JWT auth (register/login, bcrypt hashing), guards protecting task routes, frontend login/logout/protected routes, and deployment — added on Day 10

---

## A — Register a new account (password stored hashed)

**As** an API consumer,
**I want** to `POST /auth/register` with an email and password,
**So that** a new user account is created without ever persisting the password in plaintext.

**Given** no user exists with email `"alice@example.com"`
**When** I send `POST /auth/register` with body `{ "email": "alice@example.com", "password": "S3cret!pw" }`
**Then** the response status is `201 Created`
**And** the body contains the new user's `id` and `email` but no `password` field
**And** the stored `password` column is a bcrypt hash (e.g. `$2b$...`), never the literal `"S3cret!pw"`

---

## B — Register with an email that already exists (409 path)

**As** an API consumer,
**I want** a clear error when I register an email that is already taken,
**So that** I can distinguish a duplicate account from a server error.

**Given** a user already exists with email `"alice@example.com"`
**When** I send `POST /auth/register` with body `{ "email": "alice@example.com", "password": "anotherPw1" }`
**Then** the response status is `409 Conflict`
**And** the body contains `{ "statusCode": 409, "message": "Email already in use", "error": "Conflict" }`

---

## C — Login returns a signed JWT (happy path)

**As** an API consumer,
**I want** to `POST /auth/login` with valid credentials,
**So that** I receive a signed JWT I can use to authenticate subsequent requests.

**Given** a registered user with email `"alice@example.com"` and password `"S3cret!pw"`
**When** I send `POST /auth/login` with body `{ "email": "alice@example.com", "password": "S3cret!pw" }`
**Then** the response status is `200 OK`
**And** the body contains `{ "access_token": "<jwt>" }`
**And** the token is a three-part `header.payload.signature` JWT whose payload carries the user's `sub` (id) and `email`

---

## D — Login with wrong credentials (401 path)

**As** an API consumer,
**I want** login to fail with a 401 when the password is wrong,
**So that** invalid credentials never yield a token.

**Given** a registered user with email `"alice@example.com"` and password `"S3cret!pw"`
**When** I send `POST /auth/login` with body `{ "email": "alice@example.com", "password": "wrongPw" }`
**Then** the response status is `401 Unauthorized`
**And** the body contains `{ "statusCode": 401, "message": "Invalid credentials", "error": "Unauthorized" }`
**And** no `access_token` is returned

---

## E — Authenticated request to a protected route succeeds

**As** an API consumer,
**I want** to call a protected task route with a valid `Authorization: Bearer <jwt>` header,
**So that** I can manage the tasks belonging to my account.

**Given** I have a valid `access_token` obtained from `POST /auth/login`
**When** I send `GET /tasks` with header `Authorization: Bearer <access_token>`
**Then** the `JwtAuthGuard` validates the token and attaches the user to the request
**And** the response status is `200 OK`
**And** the body contains only the tasks scoped to the authenticated user's `userId`

---

## F — Unauthenticated request to a protected route gets 401

**As** an API consumer,
**I want** protected task routes to reject requests with no token,
**So that** task data is never accessible without authentication.

**Given** the task routes (`POST/PATCH/DELETE /tasks`, and `GET /tasks`) are protected by `JwtAuthGuard`
**When** I send `POST /tasks` with body `{ "title": "Buy milk" }` and **no** `Authorization` header
**Then** the response status is `401 Unauthorized`
**And** the body contains `{ "statusCode": 401, "message": "Unauthorized" }`
**And** no task is created

---

## G — Expired or invalid token is rejected (401 path)

**As** an API consumer,
**I want** the guard to reject expired or tampered tokens,
**So that** stale or forged credentials cannot access protected routes.

**Given** the `JwtModule` is configured with `JWT_SECRET` and a token expiry
**When** I send `GET /tasks` with header `Authorization: Bearer <expired-or-tampered-token>`
**Then** the `JwtStrategy` fails to verify the token
**And** the response status is `401 Unauthorized`
**And** the body contains `{ "statusCode": 401, "message": "Unauthorized" }`

---

## H — User logs in via the frontend and is redirected to tasks

**As** an end user,
**I want** to enter my email and password on the login page and sign in,
**So that** I land on my tasks page without re-entering credentials.

**Given** I am on the **Login** page with a registered account
**When** I type my email and password and click **Sign in**
**Then** the app sends my credentials to the backend and stores the returned token securely
**And** I am redirected to the **Tasks** page
**And** the header shows my logged-in email and a **Logout** button

---

## I — Login fails with a visible error message

**As** an end user,
**I want** clear feedback when my login fails,
**So that** I know to correct my email or password rather than seeing a blank screen.

**Given** I am on the **Login** page
**When** I submit an incorrect email or password and click **Sign in**
**Then** I remain on the **Login** page
**And** an inline error message such as "Invalid email or password" is shown
**And** I am not redirected and no token is stored

---

## J — Unauthenticated user visiting a protected page is redirected to login

**As** an end user,
**I want** to be sent to the login page when I open a tasks page without being signed in,
**So that** I am guided to authenticate instead of seeing protected content.

**Given** I am not signed in (no valid token stored)
**When** I navigate directly to the **Tasks** page URL
**Then** the app detects I am unauthenticated
**And** I am redirected to the **Login** page before any task data loads

---

## K — Session expiry during use redirects back to login

**As** an end user,
**I want** the app to send me back to login when my session expires,
**So that** I re-authenticate cleanly instead of seeing broken or empty data.

**Given** I am signed in and viewing the **Tasks** page
**When** my token expires and an API request returns `401 Unauthorized`
**Then** the app clears the stored session
**And** I am redirected to the **Login** page

---

## L — Logout clears the session

**As** an end user,
**I want** to log out from the header,
**So that** my session ends and my tasks can no longer be reached on this device.

**Given** I am signed in and viewing the **Tasks** page
**When** I click the **Logout** button in the header
**Then** the stored token is cleared
**And** I am redirected to the **Login** page
**And** navigating back to the **Tasks** page redirects me to **Login** again

---

## M — Deployed app works end-to-end across origins

**As** an end user,
**I want** the live frontend (Vercel) to talk to the live backend (Railway/Render),
**So that** I can register, log in, and manage tasks on the deployed app.

**Given** the frontend is deployed to Vercel with `NEXT_PUBLIC_API_URL` pointing at the deployed backend
**And** the backend is deployed with `DATABASE_URL` and `JWT_SECRET` set and migrations run
**And** CORS on the backend allows the deployed frontend origin
**When** I open the live site and complete register → login → create/update/delete a task
**Then** each request succeeds without CORS or auth errors
**And** my changes persist across page reloads
