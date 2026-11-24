import crypto from 'node:crypto'

export class StudyMaterialModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      examId: dto.examId ?? null,
      subjectId: dto.subjectId ?? null,
      topicId: dto.topicId ?? null,
      title: dto.title,
      category: dto.category,
      description: dto.description ?? '',
      format: dto.format ?? 'PDF',
      fileUrl: dto.fileUrl ?? null,
      pageCount: dto.pageCount ?? 0,
      fileSize: dto.fileSize ?? '',
      popularityScore: dto.popularityScore ?? 0,
      isPublished: dto.isPublished ?? true,
      createdAt: now,
      updatedAt: now,
    }
  }
}
