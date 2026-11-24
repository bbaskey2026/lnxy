import crypto from 'node:crypto'

export class AttemptModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      mockTestId: dto.mockTestId,
      userId: dto.userId,
      status: 'in_progress',
      answers: {},
      reviewIds: [],
      timerSeconds: dto.durationSeconds,
      startedAt: now,
      expiresAt: new Date(Date.now() + dto.durationSeconds * 1000).toISOString(),
      submittedAt: null,
    }
  }
}
