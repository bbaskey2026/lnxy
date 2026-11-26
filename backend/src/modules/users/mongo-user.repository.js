import { ApiError } from '../../utils/ApiError.js'

function toUserRecord(user) {
  if (!user) return null
  const { _id, __v, ...record } = user
  for (const field of ['purchases', 'subscriptions']) {
    if (Array.isArray(record[field])) {
      record[field] = record[field].map(({ _id: relatedId, __v: relatedVersion, ...related }) => related)
    }
  }
  return record
}

export class MongoUserRepository {
  constructor(database) {
    this.User = database.getModels().User
  }

  async findAll(filters = {}) {
    const safeFilters = Object.fromEntries(
      Object.entries(filters).filter(([key]) => ['role', 'status'].includes(key)),
    )
    const users = await this.User.find(safeFilters).lean().exec()
    return users.map(toUserRecord)
  }

  async findById(id) {
    return toUserRecord(await this.User.findOne({ id }).lean().exec())
  }

  async findByIdWithStore(id) {
    const user = await this.User.findOne({ id })
      .populate('purchases')
      .populate('subscriptions')
      .lean()
      .exec()
    return toUserRecord(user)
  }

  async findByEmail(email) {
    const user = await this.User.findOne({ email: email.trim().toLowerCase() })
      .select('+passwordHash')
      .lean()
      .exec()
    return toUserRecord(user)
  }

  async create(user) {
    const record = { ...user, email: user.email.trim().toLowerCase() }
    try {
      await this.User.create(record)
      return record
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError('An account already exists for this email', 409, 'CONFLICT')
      }
      throw error
    }
  }

  async update(id, changes) {
    try {
      const normalizedChanges = { ...changes }
      if (normalizedChanges.email) {
        normalizedChanges.email = normalizedChanges.email.trim().toLowerCase()
      }
      const user = await this.User.findOneAndUpdate(
        { id },
        { $set: { ...normalizedChanges, updatedAt: new Date().toISOString() } },
        { returnDocument: 'after', runValidators: true },
      ).lean().exec()
      return toUserRecord(user)
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError('An account already exists for this email', 409, 'CONFLICT')
      }
      throw error
    }
  }

  async delete(id) {
    const result = await this.User.deleteOne({ id }).exec()
    return result.deletedCount > 0
  }
}
