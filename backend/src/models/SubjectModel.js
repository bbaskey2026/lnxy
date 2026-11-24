import crypto from 'node:crypto'

export class SubjectModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      examId: dto.examId,
      name: dto.name,
      slug: dto.slug ?? dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }
  }
}
