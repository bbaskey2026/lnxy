import crypto from 'node:crypto'

export class TopicModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      subjectId: dto.subjectId,
      name: dto.name,
      slug: dto.slug ?? dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: now,
      updatedAt: now,
    }
  }
}
