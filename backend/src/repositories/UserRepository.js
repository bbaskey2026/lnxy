import { JsonRepository } from './JsonRepository.js'

export class UserRepository extends JsonRepository {
  constructor(database) {
    super(database, 'users')
  }

  async findByEmail(email) {
    const users = await this.findAll()
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
  }
}
