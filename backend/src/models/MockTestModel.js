import crypto from 'node:crypto'

export class MockTestModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      examId: dto.examId ?? null,
      title: dto.title,
      category: dto.category ?? 'Full-length',
      durationSeconds: dto.durationSeconds,
      positiveMarks: dto.positiveMarks ?? 1,
      negativeMarks: dto.negativeMarks ?? 0,
      questionIds: dto.questionIds ?? [],
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }
  }
}
