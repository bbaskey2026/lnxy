import crypto from 'node:crypto'

export class BookmarkModel {
  static create(dto) {
    return {
      id: crypto.randomUUID(),
      userId: dto.userId,
      entityType: dto.entityType,
      entityId: dto.entityId,
      title: dto.title ?? '',
      createdAt: new Date().toISOString(),
    }
  }
}
