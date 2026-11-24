import crypto from 'node:crypto'

export class ResultModel {
  static create(dto) {
    return {
      id: crypto.randomUUID(),
      attemptId: dto.attemptId,
      userId: dto.userId,
      mockTestId: dto.mockTestId,
      totalMarks: dto.totalMarks,
      obtainedMarks: dto.obtainedMarks,
      correctCount: dto.correctCount,
      incorrectCount: dto.incorrectCount,
      unattemptedCount: dto.unattemptedCount,
      accuracy: dto.accuracy,
      timeConsumedSeconds: dto.timeConsumedSeconds,
      createdAt: new Date().toISOString(),
    }
  }
}
