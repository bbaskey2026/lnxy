import crypto from 'node:crypto'

export class NotificationModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      title: dto.title,
      detail: dto.detail ?? '',
      category: dto.category ?? 'Platform',
      route: dto.route ?? null,
      createdAt: now,
      updatedAt: now,
    }
  }
}
