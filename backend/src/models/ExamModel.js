import crypto from 'node:crypto'

export class ExamModel {
  static create(dto) {
    const now = new Date().toISOString()
    const slug = dto.slug ?? dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return {
      id: crypto.randomUUID(),
      name: dto.name,
      slug,
      category: dto.category,
      description: dto.description ?? '',
      eligibility: dto.eligibility ?? '',
      pattern: dto.pattern ?? '',
      syllabus: dto.syllabus ?? [],
      subjects: dto.subjects ?? [],
      totalMarks: dto.totalMarks ?? 0,
      durationMinutes: dto.durationMinutes ?? 0,
      negativeMarking: dto.negativeMarking ?? 0,
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }
  }
}
