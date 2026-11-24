import crypto from 'node:crypto'

export class CourseModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      instructorId: dto.instructorId,
      title: dto.title,
      description: dto.description ?? '',
      category: dto.category ?? '',
      rating: dto.rating ?? 0,
      studentCount: dto.studentCount ?? 0,
      lectureCount: dto.lectureCount ?? 0,
      duration: dto.duration ?? '',
      progress: dto.progress ?? 0,
      isPublished: dto.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    }
  }
}
