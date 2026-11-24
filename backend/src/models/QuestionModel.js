import crypto from 'node:crypto'

export class QuestionModel {
  static create(dto) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      examId: dto.examId ?? null,
      subjectId: dto.subjectId ?? null,
      topicId: dto.topicId ?? null,
      text: dto.text,
      type: dto.type ?? 'MCQ',
      difficulty: dto.difficulty ?? 'Medium',
      options: dto.options ?? [],
      correctOptionIndex: dto.correctOptionIndex ?? null,
      explanation: dto.explanation ?? '',
      solutionSteps: dto.solutionSteps ?? [],
      isPreviousYear: dto.isPreviousYear ?? false,
      year: dto.year ?? null,
      createdAt: now,
      updatedAt: now,
    }
  }
}
