import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import supertest from 'supertest'
import crypto from 'node:crypto'
import pino from 'pino'
import { createApp } from '../../src/app.js'
import { createDatabase } from '../../src/config/database.js'
import { UserRepository } from '../../src/modules/users/user.repository.js'
import { UserService } from '../../src/modules/users/user.service.js'
import { ExamRepository } from '../../src/modules/exams/exam.repository.js'
import { AuthService } from '../../src/modules/auth/auth.service.js'
import { ExamService } from '../../src/modules/exams/exam.service.js'
import { AuthController } from '../../src/modules/auth/auth.controller.js'
import { UserController } from '../../src/modules/users/user.controller.js'
import { ExamController } from '../../src/modules/exams/exam.controller.js'
import { AuthenticateMiddleware } from '../../src/middleware/auth.middleware.js'
import { createAuthRoutes } from '../../src/modules/auth/auth.routes.js'
import { createUserRoutes } from '../../src/modules/users/user.routes.js'
import { createExamRoutes } from '../../src/modules/exams/exam.routes.js'
import { PasswordHasher } from '../../src/infrastructure/security/PasswordHasher.js'
import { TokenService } from '../../src/infrastructure/security/TokenService.js'
import { env } from '../../src/config/env.js'

let app
let database

before(async () => {
  database = createDatabase()
  await database.initialize()
  const hasher = new PasswordHasher()
  await database.write('users', [
    {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      email: 'admin@exampro.com',
      passwordHash: await hasher.hash('admin123'),
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])
  await database.write('exams', [])
  const userRepository = new UserRepository(database)
  const refreshRecords = new Map()
  const refreshTokenRepository = {
    async create(record) {
      refreshRecords.set(record.tokenHash, { ...record })
    },
    async consumeByHash(tokenHash) {
      const record = refreshRecords.get(tokenHash)
      if (!record || record.revoked || new Date(record.expiresAt).getTime() <= Date.now()) return null
      record.revoked = true
      return { ...record }
    },
    async revokeByHash(tokenHash) {
      const record = refreshRecords.get(tokenHash)
      if (record) record.revoked = true
    },
  }
  const passwordHasher = new PasswordHasher()
  const tokenService = new TokenService()
  const examRepository = new ExamRepository(database)
  const authService = new AuthService({
    userRepository,
    refreshTokenRepository,
    passwordHasher,
    tokenService,
  })
  const examService = new ExamService(examRepository)
  const authenticateMiddleware = new AuthenticateMiddleware(userRepository, tokenService)
  const authController = new AuthController(authService)
  const userController = new UserController(new UserService(userRepository))
  const examController = new ExamController(examService)
  const expressRouter = (await import('express')).default.Router()
  const authRoutes = createAuthRoutes(authController, authenticateMiddleware)
  expressRouter.use('/auth', authRoutes)
  expressRouter.use('/user/auth', authRoutes)
  expressRouter.use('/users', createUserRoutes(userController, authenticateMiddleware))
  expressRouter.use('/exams', createExamRoutes(examController, authenticateMiddleware))
  expressRouter.get('/health', (req, res) => res.status(200).json({
    status: 'SUCCESS',
    statusCode: 0,
    statusDesc: 'Health check successful',
    data: {
      status: 'ok',
      persistence: env.PERSISTENCE,
    },
  }))
  app = createApp(expressRouter, pino({ level: 'silent' }))
})

test('GET /api/v1/health returns service status', async () => {
  const response = await supertest(app).get('/api/v1/health')
  assert.equal(response.status, 200)
  assert.deepEqual(Object.keys(response.body), ['status', 'statusCode', 'statusDesc', 'data'])
  assert.equal(response.body.status, 'SUCCESS')
  assert.equal(response.body.statusCode, 0)
  assert.equal(response.body.statusDesc, 'Health check successful')
  assert.equal(response.body.data.status, 'ok')
  assert.equal(response.body.data.persistence, 'json')
})

test('legacy /api routes remain available', async () => {
  const response = await supertest(app).get('/api/health')

  assert.equal(response.status, 200)
  assert.equal(response.body.status, 'SUCCESS')
  assert.equal(response.body.data.status, 'ok')
})

test('API not-found responses use the standard failure response shape', async () => {
  const response = await supertest(app).get('/api/v1/does-not-exist')

  assert.equal(response.status, 404)
  assert.deepEqual(Object.keys(response.body), ['status', 'statusCode', 'statusDesc', 'data'])
  assert.equal(response.body.status, 'FAILED')
  assert.equal(response.body.statusCode, 1)
  assert.equal(response.body.data.code, 'NOT_FOUND')
  assert.equal(typeof response.body.statusDesc, 'string')
})

test('GET /api/v1/assets/previews serves backend-hosted preview images', async () => {
  const response = await supertest(app).get('/api/v1/assets/previews/current-affairs-government.svg')

  assert.equal(response.status, 200)
  assert.match(response.headers['content-type'], /image\/svg\+xml/)
  assert.match(response.body.toString('utf8'), /POLICY &amp; GOVERNANCE/)
})

test('student can register, receive an access token, and read profile', async () => {
  const registration = await supertest(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Test Student', email: 'student@example.com', password: 'password123' })

  assert.equal(registration.status, 201)
  assert.deepEqual(Object.keys(registration.body), ['status', 'statusCode', 'statusDesc', 'data'])
  assert.equal(registration.body.status, 'SUCCESS')
  assert.equal(registration.body.statusCode, 0)
  assert.equal(registration.body.statusDesc, 'Account registered successfully')
  assert.equal(registration.body.data.user.role, 'student')
  assert.deepEqual(registration.body.data.user.purchases, [])
  assert.deepEqual(registration.body.data.user.subscriptions, [])
  assert.ok(registration.body.data.accessToken)
  assert.equal('passwordHash' in registration.body.data.user, false)
  assert.equal('refreshToken' in registration.body.data, false)

  const profile = await supertest(app)
    .get('/api/v1/auth/me')
    .set('Authorization', registration.body.data.accessToken)

  assert.equal(profile.status, 200)
  assert.equal(profile.body.data.email, 'student@example.com')
  assert.deepEqual(profile.body.data.purchases, [])
  assert.deepEqual(profile.body.data.subscriptions, [])

  const bearerProfile = await supertest(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${registration.body.data.accessToken}`)
  assert.equal(bearerProfile.status, 200)
})

test('refresh rotates the session and logout revokes the replacement token', async () => {
  const registration = await supertest(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Refresh Student', email: 'refresh@example.com', password: 'password123' })
  const initialCookie = registration.headers['set-cookie'][0].split(';')[0]

  const refresh = await supertest(app)
    .post('/api/v1/auth/refresh')
    .set('Cookie', initialCookie)

  assert.equal(refresh.status, 200)
  assert.equal(refresh.body.status, 'SUCCESS')
  assert.equal(refresh.body.statusDesc, 'Session refreshed successfully')
  assert.ok(refresh.body.data.accessToken)
  const replacementCookie = refresh.headers['set-cookie'][0].split(';')[0]

  const replay = await supertest(app)
    .post('/api/v1/auth/refresh')
    .set('Cookie', initialCookie)
  assert.equal(replay.status, 401)
  assert.equal(replay.body.status, 'FAILED')

  const logout = await supertest(app)
    .post('/api/v1/auth/logout')
    .set('Cookie', replacementCookie)
  assert.equal(logout.status, 200)
  assert.equal(logout.body.statusDesc, 'Signed out successfully')

  const refreshAfterLogout = await supertest(app)
    .post('/api/v1/auth/refresh')
    .set('Cookie', replacementCookie)
  assert.equal(refreshAfterLogout.status, 401)
})

test('students cannot access another user or grant themselves admin privileges', async () => {
  const registration = await supertest(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Restricted Student', email: 'restricted@example.com', password: 'password123' })
  const accessToken = registration.body.data.accessToken
  const userId = registration.body.data.user.id

  const changeRole = await supertest(app)
    .patch(`/api/v1/users/${userId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ role: 'admin' })
  assert.equal(changeRole.status, 403)
  assert.equal(changeRole.body.data.code, 'AUTHORIZATION_ERROR')

  const otherAccount = await supertest(app)
    .get('/api/v1/users/not-the-student')
    .set('Authorization', `Bearer ${accessToken}`)
  assert.equal(otherAccount.status, 403)
  assert.equal(otherAccount.body.data.code, 'AUTHORIZATION_ERROR')
})

test('login validates credentials', async () => {
  const valid = await supertest(app)
    .post('/api/v1/user/auth/dashboard')
    .send({ email: 'admin@exampro.com', password: 'admin123' })
  assert.equal(valid.status, 200)
  assert.equal(valid.body.statusDesc, 'Login successful')
  assert.equal(valid.body.data.user.role, 'admin')
  assert.deepEqual(valid.body.data.user.purchases, [])
  assert.deepEqual(valid.body.data.user.subscriptions, [])

  const invalid = await supertest(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@exampro.com', password: 'wrong-password' })
  assert.equal(invalid.status, 401)
  assert.equal(invalid.body.status, 'FAILED')
  assert.equal(invalid.body.statusCode, 1)
  assert.equal(invalid.body.data.code, 'AUTHENTICATION_ERROR')
})

test('admin can create and update an examination', async () => {
  const login = await supertest(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@exampro.com', password: 'admin123' })
  const token = login.body.data.accessToken

  const created = await supertest(app)
    .post('/api/v1/exams')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'SSC CHSL',
      category: 'SSC Examinations',
      description: 'Clerical recruitment examination.',
      durationMinutes: 60,
      totalMarks: 200,
    })

  assert.equal(created.status, 201)
  assert.equal(created.body.statusDesc, 'Examination created successfully')
  assert.equal(created.body.data.name, 'SSC CHSL')
  assert.equal(created.body.data.slug, 'ssc-chsl')

  const updated = await supertest(app)
    .patch(`/api/v1/exams/${created.body.data.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ totalMarks: 220 })
  assert.equal(updated.status, 200)
  assert.equal(updated.body.data.totalMarks, 220)
})

test('student cannot create an examination', async () => {
  const login = await supertest(app)
    .post('/api/v1/auth/login')
    .send({ email: 'student@example.com', password: 'password123' })

  const response = await supertest(app)
    .post('/api/v1/exams')
    .set('Authorization', `Bearer ${login.body.data.accessToken}`)
    .send({ name: 'Unauthorized Exam', category: 'Test' })

  assert.equal(response.status, 403)
  assert.equal(response.body.status, 'FAILED')
  assert.equal(response.body.statusCode, 1)
  assert.equal(response.body.data.code, 'AUTHORIZATION_ERROR')
})
