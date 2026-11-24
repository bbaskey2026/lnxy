import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import supertest from 'supertest'
import crypto from 'node:crypto'
import pino from 'pino'
import { createApp } from '../../src/app.js'
import { createDatabase } from '../../src/config/database.js'
import { UserRepository } from '../../src/repositories/UserRepository.js'
import { ExamRepository } from '../../src/repositories/ExamRepository.js'
import { AuthService } from '../../src/services/AuthService.js'
import { ExamService } from '../../src/services/ExamService.js'
import { AuthController } from '../../src/controllers/AuthController.js'
import { ExamController } from '../../src/controllers/ExamController.js'
import { AuthenticateMiddleware } from '../../src/middleware/authenticate.js'
import { createAuthRoutes } from '../../src/routes/auth.routes.js'
import { createExamRoutes } from '../../src/routes/exam.routes.js'
import { PasswordHasher } from '../../src/infrastructure/security/PasswordHasher.js'
import { env } from '../../src/config/env.config.js'

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
  await database.write('refresh-tokens', [])
  const userRepository = new UserRepository(database)
  const examRepository = new ExamRepository(database)
  const authService = new AuthService(userRepository, database)
  const examService = new ExamService(examRepository)
  const authenticateMiddleware = new AuthenticateMiddleware(userRepository)
  const authController = new AuthController(authService)
  const examController = new ExamController(examService)
  const expressRouter = (await import('express')).default.Router()
  expressRouter.use('/auth', createAuthRoutes(authController, authenticateMiddleware))
  expressRouter.use('/exams', createExamRoutes(examController, authenticateMiddleware))
  expressRouter.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok', persistence: env.PERSISTENCE } }))
  app = createApp(expressRouter, pino({ level: 'silent' }))
})

test('GET /api/health returns service status', async () => {
  const response = await supertest(app).get('/api/health')
  assert.equal(response.status, 200)
  assert.equal(response.body.success, true)
  assert.equal(response.body.data.status, 'ok')
  assert.equal(response.body.data.persistence, 'json')
})

test('student can register, receive an access token, and read profile', async () => {
  const registration = await supertest(app)
    .post('/api/auth/register')
    .send({ name: 'Test Student', email: 'student@example.com', password: 'password123' })

  assert.equal(registration.status, 201)
  assert.equal(registration.body.success, true)
  assert.equal(registration.body.data.user.role, 'student')
  assert.ok(registration.body.data.accessToken)

  const profile = await supertest(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${registration.body.data.accessToken}`)

  assert.equal(profile.status, 200)
  assert.equal(profile.body.data.email, 'student@example.com')
})

test('login validates credentials', async () => {
  const valid = await supertest(app)
    .post('/api/auth/login')
    .send({ email: 'admin@exampro.com', password: 'admin123' })
  assert.equal(valid.status, 200)
  assert.equal(valid.body.data.user.role, 'admin')

  const invalid = await supertest(app)
    .post('/api/auth/login')
    .send({ email: 'admin@exampro.com', password: 'wrong-password' })
  assert.equal(invalid.status, 401)
  assert.equal(invalid.body.error.code, 'AUTHENTICATION_ERROR')
})

test('admin can create and update an examination', async () => {
  const login = await supertest(app)
    .post('/api/auth/login')
    .send({ email: 'admin@exampro.com', password: 'admin123' })
  const token = login.body.data.accessToken

  const created = await supertest(app)
    .post('/api/exams')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'SSC CHSL',
      category: 'SSC Examinations',
      description: 'Clerical recruitment examination.',
      durationMinutes: 60,
      totalMarks: 200,
    })

  assert.equal(created.status, 201)
  assert.equal(created.body.data.name, 'SSC CHSL')
  assert.equal(created.body.data.slug, 'ssc-chsl')

  const updated = await supertest(app)
    .patch(`/api/exams/${created.body.data.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ totalMarks: 220 })
  assert.equal(updated.status, 200)
  assert.equal(updated.body.data.totalMarks, 220)
})

test('student cannot create an examination', async () => {
  const login = await supertest(app)
    .post('/api/auth/login')
    .send({ email: 'student@example.com', password: 'password123' })

  const response = await supertest(app)
    .post('/api/exams')
    .set('Authorization', `Bearer ${login.body.data.accessToken}`)
    .send({ name: 'Unauthorized Exam', category: 'Test' })

  assert.equal(response.status, 403)
  assert.equal(response.body.error.code, 'AUTHORIZATION_ERROR')
})
