import crypto from 'node:crypto'

export class LectureModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      courseId: dto.courseId,
      moduleId: dto.moduleId ?? null,
      title: dto.title,
      description: dto.description ?? '',
      videoSource: dto.videoSource ?? '',
      durationSeconds: dto.durationSeconds ?? 0,
      sortOrder: dto.sortOrder ?? 0,
      attachmentUrl: dto.attachmentUrl ?? null,
      createdAt: now,
      updatedAt: now,
    }
  }
}
