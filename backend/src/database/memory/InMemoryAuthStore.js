import { ApiError } from '../../utils/ApiError.js'

function cloneStoreRecord(record) {
  return {
    ...record,
    ...(Array.isArray(record.items) ? { items: record.items.map((item) => ({ ...item })) } : {}),
    ...(record.payment ? { payment: { ...record.payment } } : {}),
  }
}

export class InMemoryUserRepository {
  constructor(users = new Map(), purchases = new Map(), subscriptions = new Map()) {
    this.users = users
    this.purchases = purchases
    this.subscriptions = subscriptions
  }

  async findAll(filters = {}) {
    const safeFilters = Object.fromEntries(
      Object.entries(filters).filter(([key]) => ['role', 'status'].includes(key)),
    )
    return [...this.users.values()]
      .filter((user) => Object.entries(safeFilters).every(([key, value]) => user[key] === value))
      .map((user) => ({ ...user }))
  }

  async findById(id) {
    const user = this.users.get(id)
    return user ? { ...user } : null
  }

  async findByIdWithStore(id) {
    const user = await this.findById(id)
    if (!user) return null
    return {
      ...user,
      purchases: [...this.purchases.values()]
        .filter((purchase) => purchase.studentId === id)
        .map(cloneStoreRecord),
      subscriptions: [...this.subscriptions.values()]
        .filter((subscription) => subscription.studentId === id)
        .map(cloneStoreRecord),
    }
  }

  async findByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = [...this.users.values()].find((entry) => entry.email === normalizedEmail)
    return user ? { ...user } : null
  }

  async create(user) {
    const record = { ...user, email: user.email.trim().toLowerCase() }
    if ([...this.users.values()].some((entry) => entry.email === record.email)) {
      throw new ApiError('An account already exists for this email', 409, 'CONFLICT')
    }
    this.users.set(record.id, record)
    return { ...record }
  }

  async update(id, changes) {
    const existing = this.users.get(id)
    if (!existing) return null

    const normalizedChanges = { ...changes }
    if (normalizedChanges.email) {
      normalizedChanges.email = normalizedChanges.email.trim().toLowerCase()
      const duplicate = [...this.users.values()].some(
        (user) => user.id !== id && user.email === normalizedChanges.email,
      )
      if (duplicate) {
        throw new ApiError('An account already exists for this email', 409, 'CONFLICT')
      }
    }

    const updated = {
      ...existing,
      ...normalizedChanges,
      updatedAt: new Date().toISOString(),
    }
    this.users.set(id, updated)
    return { ...updated }
  }

  async delete(id) {
    return this.users.delete(id)
  }
}

export class InMemoryRefreshTokenRepository {
  constructor(tokens = new Map()) {
    this.tokens = tokens
  }

  async create(record) {
    this.tokens.set(record.tokenHash, {
      ...record,
      revoked: false,
    })
  }

  async consumeByHash(tokenHash) {
    const record = this.tokens.get(tokenHash)
    if (!record || record.revoked || new Date(record.expiresAt) <= new Date()) return null

    const consumed = { ...record }
    record.revoked = true
    record.revokedAt = new Date()
    return consumed
  }

  async revokeByHash(tokenHash) {
    const record = this.tokens.get(tokenHash)
    if (record && !record.revoked) {
      record.revoked = true
      record.revokedAt = new Date()
    }
  }
}

export class InMemoryPurchaseRepository {
  constructor(purchases = new Map()) {
    this.purchases = purchases
  }

  async create(purchase) {
    const record = cloneStoreRecord(purchase)
    this.purchases.set(record.id, record)
    return cloneStoreRecord(record)
  }

  async findByStudentId(studentId) {
    return [...this.purchases.values()]
      .filter((purchase) => purchase.studentId === studentId)
      .map(cloneStoreRecord)
  }
}

export class InMemorySubscriptionRepository {
  constructor(subscriptions = new Map()) {
    this.subscriptions = subscriptions
  }

  async create(subscription) {
    const record = cloneStoreRecord(subscription)
    this.subscriptions.set(record.id, record)
    return cloneStoreRecord(record)
  }

  async findByStudentId(studentId) {
    return [...this.subscriptions.values()]
      .filter((subscription) => subscription.studentId === studentId)
      .map(cloneStoreRecord)
  }
}

export class InMemoryAuthStore {
  constructor() {
    this.users = new Map()
    this.refreshTokens = new Map()
    this.purchases = new Map()
    this.subscriptions = new Map()
    this.userRepository = new InMemoryUserRepository(this.users, this.purchases, this.subscriptions)
    this.refreshTokenRepository = new InMemoryRefreshTokenRepository(this.refreshTokens)
    this.purchaseRepository = new InMemoryPurchaseRepository(this.purchases)
    this.subscriptionRepository = new InMemorySubscriptionRepository(this.subscriptions)
  }
}
