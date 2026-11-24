import { BaseRepository } from '../../../core/interfaces/BaseRepository.js'

export class UserRepository extends BaseRepository {
  constructor({ jsonDatabase }) {
    super()
    this.database = jsonDatabase
  }

  async findAll() {
    return this.database.read('users')
  }

  async findById(id) {
    const users = await this.findAll()
    return users.find((user) => user.id === id) ?? null
  }

  async findByEmail(email) {
    const users = await this.findAll()
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
  }

  async create(user) {
    const users = await this.findAll()
    users.push(user)
    await this.database.write('users', users)
    return user
  }

  async update(id, changes) {
    const users = await this.findAll()
    const index = users.findIndex((user) => user.id === id)
    if (index === -1) return null
    users[index] = { ...users[index], ...changes, updatedAt: new Date().toISOString() }
    await this.database.write('users', users)
    return users[index]
  }

  async delete(id) {
    const users = await this.findAll()
    const remaining = users.filter((user) => user.id !== id)
    if (remaining.length === users.length) return false
    await this.database.write('users', remaining)
    return true
  }
}
