import assert from 'node:assert/strict'
import test from 'node:test'
import { createAuthPersistence } from '../../src/database/authPersistence.js'
import { AuthService } from '../../src/modules/auth/auth.service.js'
import { PasswordHasher } from '../../src/infrastructure/security/PasswordHasher.js'
import { TokenService } from '../../src/infrastructure/security/TokenService.js'

function createLogger() {
  const warnings = []
  return {
    warnings,
    warn(fields, message) {
      warnings.push({ fields, message })
    },
    info() {},
  }
}

test('selects memory persistence and loads demo purchases when configured', async () => {
  const logger = createLogger()
  class MongoDatabaseMustNotBeCreated {
    constructor() {
      throw new Error('MongoDB must not be used in memory mode.')
    }
  }

  const persistence = await createAuthPersistence({
    logger,
    environment: {
      NODE_ENV: 'development',
      AUTH_PERSISTENCE: 'memory',
      MONGODB_URI: 'mongodb://localhost:27017',
    },
    MongoDatabaseClass: MongoDatabaseMustNotBeCreated,
  })

  assert.equal(persistence.storage, 'memory')
  const user = await persistence.userRepository.findByEmail('aarav@example.com')
  assert.ok(user)
  const storeData = await persistence.userRepository.findByIdWithStore(user.id)
  assert.deepEqual(
    storeData.purchases.flatMap((purchase) => purchase.items.map((item) => item.mockTestType))
      .filter(Boolean),
    ['full', 'sectional', 'topic'],
  )

  const authService = new AuthService({
    userRepository: persistence.userRepository,
    refreshTokenRepository: persistence.refreshTokenRepository,
    passwordHasher: new PasswordHasher(),
    tokenService: new TokenService(),
  })
  const session = await authService.login({
    email: 'aarav@example.com',
    password: 'student123',
  })
  assert.deepEqual(
    session.user.purchases.flatMap((purchase) => purchase.items.map((item) => item.mockTestType))
      .filter(Boolean),
    ['full', 'sectional', 'topic'],
  )
  const profile = await authService.getProfile(user.id)
  assert.deepEqual(
    profile.purchases.flatMap((purchase) => purchase.items.map((item) => item.mockTestType))
      .filter(Boolean),
    ['full', 'sectional', 'topic'],
  )
})

test('falls back to in-memory auth storage when MongoDB is unavailable outside production', async () => {
  const connectionError = new Error('MongoDB unavailable')
  class UnavailableMongoDatabase {
    async initialize() {
      throw connectionError
    }
  }
  const logger = createLogger()

  const persistence = await createAuthPersistence({
    logger,
    environment: { NODE_ENV: 'development', MONGODB_URI: 'mongodb://localhost:27017' },
    MongoDatabaseClass: UnavailableMongoDatabase,
  })

  assert.equal(persistence.storage, 'memory')
  assert.equal(persistence.mongoDatabase, null)
  assert.equal(logger.warnings.length, 1)

  const user = await persistence.userRepository.create({
    id: 'user-1',
    email: ' TEST@example.com ',
    name: 'Test User',
  })
  assert.equal(user.email, 'test@example.com')
  assert.equal((await persistence.userRepository.findByEmail('test@example.com')).id, 'user-1')
  const duplicateAttempts = await Promise.allSettled([
    persistence.userRepository.create({ id: 'user-2', email: 'test@example.com' }),
    persistence.userRepository.create({ id: 'user-3', email: ' TEST@example.com ' }),
  ])
  assert.equal(duplicateAttempts.filter((result) => result.status === 'fulfilled').length, 0)

  await persistence.refreshTokenRepository.create({
    id: 'session-1',
    userId: 'user-1',
    tokenHash: 'hashed-token',
    expiresAt: new Date(Date.now() + 60_000),
  })
  assert.ok(await persistence.refreshTokenRepository.consumeByHash('hashed-token'))
  assert.equal(await persistence.refreshTokenRepository.consumeByHash('hashed-token'), null)
})

test('does not allow explicitly selected memory persistence in production', async () => {
  await assert.rejects(
    createAuthPersistence({
      logger: createLogger(),
      environment: { NODE_ENV: 'production', AUTH_PERSISTENCE: 'memory' },
    }),
    /AUTH_PERSISTENCE=memory is not allowed in production/,
  )
})

test('does not fall back to memory when MongoDB is unavailable in production', async () => {
  const connectionError = new Error('MongoDB unavailable')
  class UnavailableMongoDatabase {
    async initialize() {
      throw connectionError
    }
  }
  const logger = createLogger()

  await assert.rejects(
    createAuthPersistence({
      logger,
      environment: { NODE_ENV: 'production', MONGODB_URI: 'mongodb://localhost:27017' },
      MongoDatabaseClass: UnavailableMongoDatabase,
    }),
    (error) => error === connectionError,
  )
  assert.equal(logger.warnings.length, 0)
})
