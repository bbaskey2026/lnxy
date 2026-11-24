import { JsonRepository } from './JsonRepository.js'

export class NoteRepository extends JsonRepository {
  constructor(database) {
    super(database, 'notes')
  }

  async findByUser(userId) {
    return this.findAll({ userId })
  }
}
