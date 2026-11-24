import crypto from 'node:crypto'

export class NoteModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      userId: dto.userId,
      subject: dto.subject ?? 'General',
      title: dto.title,
      content: dto.content,
      entityType: dto.entityType ?? null,
      entityId: dto.entityId ?? null,
      createdAt: now,
      updatedAt: now,
    }
  }
}
