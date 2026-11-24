import crypto from 'node:crypto'

export class UserModel {
  static normalize(user) {
    const { passwordHash, refreshTokens, ...safeUser } = user
    return safeUser
  }

  static create(dto, passwordHash) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: dto.role ?? 'student',
      status: dto.status ?? 'active',
      targetExam: dto.targetExam ?? null,
      createdAt: now,
      updatedAt: now,
    }
  }
}
