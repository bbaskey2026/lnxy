import crypto from 'node:crypto'
import { env } from '../config/env.js'
import { MongoDatabase } from './mongodb/MongoDatabase.js'
import { InMemoryAuthStore } from './memory/InMemoryAuthStore.js'
import { createDemoPurchaseRecords } from './memory/demoPurchaseFixtures.js'
import { MongoRefreshTokenRepository } from '../modules/auth/mongo-refresh-token.repository.js'
import { MongoUserRepository } from '../modules/users/mongo-user.repository.js'
import { PasswordHasher } from '../infrastructure/security/PasswordHasher.js'

async function createMemoryPersistence(logger, reason, error, seedDemoData = false) {
  const memoryDatabase = new InMemoryAuthStore()
  logger.warn({
    event: 'auth.persistence.memory_selected',
    storage: 'memory',
    ...(error ? { errorName: error.name, errorCode: error.code } : {}),
  }, `Using process-local auth storage (${reason}). Data will be lost when the server stops.`)

  if (seedDemoData) {
    const now = new Date().toISOString()
    const passwordHash = await new PasswordHasher().hash('student123')
    const demoUser = {
      id: crypto.randomUUID(),
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      passwordHash,
      role: 'student',
      status: 'active',
      targetExam: 'SSC CGL',
      createdAt: now,
      updatedAt: now,
    }
    await memoryDatabase.userRepository.create(demoUser)
    for (const purchase of createDemoPurchaseRecords(demoUser.id)) {
      await memoryDatabase.purchaseRepository.create(purchase)
    }
    logger.info({
      event: 'auth.persistence.memory_demo_seeded',
      seededPurchases: memoryDatabase.purchases.size,
    }, 'In-memory demo student and purchases loaded')
  }

  return {
    storage: 'memory',
    mongoDatabase: null,
    memoryDatabase,
    userRepository: memoryDatabase.userRepository,
    refreshTokenRepository: memoryDatabase.refreshTokenRepository,
    purchaseRepository: memoryDatabase.purchaseRepository,
    subscriptionRepository: memoryDatabase.subscriptionRepository,
  }
}

export async function createAuthPersistence({
  logger,
  environment = env,
  MongoDatabaseClass = MongoDatabase,
}) {
  const authPersistence = environment.AUTH_PERSISTENCE ?? 'mongodb'
  if (authPersistence === 'memory') {
    if (environment.NODE_ENV === 'production') {
      throw new Error('AUTH_PERSISTENCE=memory is not allowed in production.')
    }
    return createMemoryPersistence(logger, 'selected by configuration', undefined, true)
  }

  if (!environment.MONGODB_URI) {
    if (environment.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI is required for production authentication persistence.')
    }
    return createMemoryPersistence(logger, 'MongoDB is not configured')
  }

  let mongoDatabase
  try {
    mongoDatabase = new MongoDatabaseClass({ logger })
    await mongoDatabase.initialize()
  } catch (error) {
    if (environment.NODE_ENV === 'production') throw error
    return createMemoryPersistence(logger, 'MongoDB is unavailable', error)
  }

  return {
    storage: 'mongodb',
    mongoDatabase,
    memoryDatabase: null,
    userRepository: new MongoUserRepository(mongoDatabase),
    refreshTokenRepository: new MongoRefreshTokenRepository(mongoDatabase),
    purchaseRepository: null,
    subscriptionRepository: null,
  }
}
