import { JsonRepository } from '../../repositories/JsonRepository.js'

export class UserRepository extends JsonRepository {
  constructor(database) {
    super(database, 'users')
  }

  async findByEmail(email) {
    const users = await this.findAll()
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
  }

  async findByIdWithStore(id) {
    const user = await this.findById(id)
    return user ? { ...user, purchases: [], subscriptions: [] } : null
  }
}
