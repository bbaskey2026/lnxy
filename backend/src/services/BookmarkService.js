import { CrudService } from './CrudService.js'
import { BookmarkModel } from '../models/BookmarkModel.js'

export class BookmarkService extends CrudService {
  constructor(bookmarkRepository) {
    super(bookmarkRepository, BookmarkModel, 'Bookmark')
  }

  async toggle(userId, dto) {
    const existing = (await this.repository.findByUser(userId))
      .find((bookmark) => bookmark.entityType === dto.entityType && bookmark.entityId === dto.entityId)
    if (existing) {
      await this.repository.delete(existing.id)
      return { bookmarked: false }
    }
    const bookmark = await this.repository.create(BookmarkModel.create({ ...dto, userId }))
    return { bookmarked: true, bookmark }
  }
}
