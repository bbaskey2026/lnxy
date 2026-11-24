import { JsonRepository } from './JsonRepository.js'

export class BookmarkRepository extends JsonRepository {
  constructor(database) {
    super(database, 'bookmarks')
  }

  async findByUser(userId) {
    return this.findAll({ userId })
  }
}
