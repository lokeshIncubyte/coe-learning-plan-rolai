// Dependency-free mock of the Task Management NestJS backend, for e2e tests.
// Implements the documented API contract with in-memory state on port 3001.
// Server Components fetch this server-side; client components fetch from the
// browser (hence permissive CORS). State resets on process start and via
// POST /__test__/reset.
import { createServer } from 'node:http'

const PORT = Number(process.env.MOCK_API_PORT) || 3001
const STATUSES = ['OPEN', 'IN_PROGRESS', 'DONE']

let tasks = []
let users = []
let seq = 0
const id = (p) => `${p}-${(++seq).toString().padStart(4, '0')}`
const now = () => new Date('2026-06-01T00:00:00.000Z').toISOString()

function seed() {
  tasks = []
  users = []
  seq = 0
  const alice = { id: id('user'), name: 'Alice', email: 'alice@example.com', createdAt: now() }
  const bob = { id: id('user'), name: 'Bob', email: 'bob@example.com', createdAt: now() }
  users = [alice, bob]
  const mk = (title, description, status, userId) => ({
    id: id('task'), title, description, status, userId,
    createdAt: now(), updatedAt: now(),
  })
  tasks = [
    mk('Write project proposal', 'Draft the Q3 proposal', 'OPEN', alice.id),
    mk('Review pull requests', 'Clear the review queue', 'IN_PROGRESS', alice.id),
    mk('Deploy to staging', 'Ship the latest build', 'DONE', bob.id),
    mk('Plan sprint', 'Backlog grooming', 'OPEN', bob.id),
    mk('Fix login bug', 'Users report 500 on login', 'IN_PROGRESS', null),
  ]
}
seed()

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  })
  res.end(status === 204 ? undefined : JSON.stringify(body))
}

const readBody = (req) =>
  new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch { resolve({}) }
    })
  })

const server = createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://localhost:${PORT}`)
  const method = req.method

  if (method === 'OPTIONS') return json(res, 204, null)
  if (method === 'POST' && pathname === '/__test__/reset') { seed(); return json(res, 200, { ok: true }) }

  // ---- Tasks ----
  if (pathname === '/tasks/stats' && method === 'GET') {
    return json(res, 200, { total: tasks.length, open: tasks.filter((t) => t.status === 'OPEN').length })
  }
  if (pathname === '/tasks' && method === 'GET') {
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.max(1, Number(searchParams.get('limit')) || 10)
    const start = (page - 1) * limit
    return json(res, 200, { data: tasks.slice(start, start + limit), total: tasks.length, page, limit })
  }
  if (pathname === '/tasks' && method === 'POST') {
    const body = await readBody(req)
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return json(res, 400, { statusCode: 400, message: ['title should not be empty'], error: 'Bad Request' })
    }
    if (body.status && !STATUSES.includes(body.status)) {
      return json(res, 400, { statusCode: 400, message: ['status must be a valid enum value'], error: 'Bad Request' })
    }
    const task = {
      id: id('task'), title: body.title, description: body.description ?? null,
      status: body.status ?? 'OPEN', userId: body.userId ?? null, createdAt: now(), updatedAt: now(),
    }
    tasks.unshift(task)
    return json(res, 201, task)
  }
  const taskMatch = pathname.match(/^\/tasks\/([^/]+)$/)
  if (taskMatch) {
    const tid = taskMatch[1]
    const idx = tasks.findIndex((t) => t.id === tid)
    if (method === 'GET') {
      if (idx === -1) return json(res, 404, { statusCode: 404, message: `Task #${tid} not found`, error: 'Not Found' })
      return json(res, 200, tasks[idx])
    }
    if (method === 'PATCH') {
      if (idx === -1) return json(res, 404, { statusCode: 404, message: `Task #${tid} not found`, error: 'Not Found' })
      const body = await readBody(req)
      if (body.status && !STATUSES.includes(body.status)) {
        return json(res, 400, { statusCode: 400, message: ['status must be a valid enum value'], error: 'Bad Request' })
      }
      tasks[idx] = { ...tasks[idx], ...body, id: tid, updatedAt: now() }
      return json(res, 200, tasks[idx])
    }
    if (method === 'DELETE') {
      if (idx === -1) return json(res, 404, { statusCode: 404, message: `Task #${tid} not found`, error: 'Not Found' })
      tasks.splice(idx, 1)
      return json(res, 204, null)
    }
  }

  // ---- Users ----
  if (pathname === '/users' && method === 'POST') {
    const body = await readBody(req)
    if (!body.email || !body.name) {
      return json(res, 400, { statusCode: 400, message: ['name and email are required'], error: 'Bad Request' })
    }
    if (users.some((u) => u.email === body.email)) {
      return json(res, 409, { statusCode: 409, message: 'Email already in use', error: 'Conflict' })
    }
    const user = { id: id('user'), name: body.name, email: body.email, createdAt: now() }
    users.push(user)
    return json(res, 201, user)
  }
  const userMatch = pathname.match(/^\/users\/([^/]+)$/)
  if (userMatch && method === 'GET') {
    const uid = userMatch[1]
    const user = users.find((u) => u.id === uid)
    if (!user) return json(res, 404, { statusCode: 404, message: `User #${uid} not found`, error: 'Not Found' })
    return json(res, 200, { ...user, tasks: tasks.filter((t) => t.userId === uid) })
  }

  // ---- Auth (day 10) ----
  if (pathname === '/auth/register' && method === 'POST') {
    const body = await readBody(req)
    if (!body.email || !body.password) return json(res, 400, { statusCode: 400, message: 'email and password required', error: 'Bad Request' })
    if (users.some((u) => u.email === body.email)) return json(res, 409, { statusCode: 409, message: 'Email already in use', error: 'Conflict' })
    const user = { id: id('user'), name: body.name ?? body.email, email: body.email, createdAt: now() }
    users.push(user)
    return json(res, 201, { id: user.id, email: user.email })
  }
  if (pathname === '/auth/login' && method === 'POST') {
    const body = await readBody(req)
    if (body.email && body.password) {
      return json(res, 200, { access_token: `mock.jwt.${Buffer.from(body.email).toString('base64url')}` })
    }
    return json(res, 401, { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' })
  }
  if (pathname === '/auth/me' && method === 'GET') {
    const auth = req.headers['authorization'] || ''
    if (auth.startsWith('Bearer mock.jwt.')) return json(res, 200, { email: 'authenticated@example.com' })
    return json(res, 401, { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' })
  }

  return json(res, 404, { statusCode: 404, message: `Cannot ${method} ${pathname}`, error: 'Not Found' })
})

server.listen(PORT, () => console.log(`mock-api listening on http://localhost:${PORT}`))
