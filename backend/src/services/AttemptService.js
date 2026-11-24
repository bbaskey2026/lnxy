import { ApiError } from '../utils/ApiError.js'
import { AttemptModel } from '../models/AttemptModel.js'

export class AttemptService {
  constructor(attemptRepository, mockTestRepository, questionRepository) {
    this.attemptRepository = attemptRepository
    this.mockTestRepository = mockTestRepository
    this.questionRepository = questionRepository
  }

  async start(userId, mockTestId) {
    const test = await this.mockTestRepository.findById(mockTestId)
    if (!test) throw new ApiError('Mock test not found', 404, 'NOT_FOUND')
    if (!test.isActive) throw new ApiError('Mock test is not active', 409, 'CONFLICT')
    return this.attemptRepository.create(AttemptModel.create({
      mockTestId,
      userId,
      durationSeconds: test.durationSeconds,
    }))
  }

  async saveAnswer(userId, attemptId, dto) {
    const attempt = await this.attemptRepository.findById(attemptId)
    if (!attempt || attempt.userId !== userId) throw new ApiError('Attempt not found', 404, 'NOT_FOUND')
    if (attempt.status !== 'in_progress') throw new ApiError('Attempt is already submitted', 409, 'CONFLICT')
    attempt.answers[dto.questionId] = dto.selectedOptionIndex
    if (dto.markedForReview) {
      if (!attempt.reviewIds.includes(dto.questionId)) attempt.reviewIds.push(dto.questionId)
    } else {
      attempt.reviewIds = attempt.reviewIds.filter((id) => id !== dto.questionId)
    }
    return this.attemptRepository.update(attemptId, attempt)
  }

  async submit(userId, attemptId) {
    const attempt = await this.attemptRepository.findById(attemptId)
    if (!attempt || attempt.userId !== userId) throw new ApiError('Attempt not found', 404, 'NOT_FOUND')
    if (attempt.status === 'submitted') throw new ApiError('Attempt was already submitted', 409, 'CONFLICT')
    const test = await this.mockTestRepository.findById(attempt.mockTestId)
    const questions = await this.questionRepository.findAll()
    const testQuestions = questions.filter((question) => test.questionIds.includes(question.id))

    let correctCount = 0
    let incorrectCount = 0
    let unattemptedCount = 0
    testQuestions.forEach((question) => {
      const selected = attempt.answers[question.id]
      if (selected === undefined) unattemptedCount++
      else if (selected === question.correctOptionIndex) correctCount++
      else incorrectCount++
    })
    const obtainedMarks = correctCount * test.positiveMarks - incorrectCount * test.negativeMarks
    const totalMarks = testQuestions.length * test.positiveMarks
    const answeredCount = correctCount + incorrectCount
    const accuracy = answeredCount ? Number(((correctCount / answeredCount) * 100).toFixed(1)) : 0
    const timeConsumedSeconds = test.durationSeconds - attempt.timerSeconds

    const submitted = await this.attemptRepository.update(attemptId, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    })
    return {
      attempt: submitted,
      result: {
        mockTestId: test.id,
        totalMarks,
        obtainedMarks: Number(obtainedMarks.toFixed(2)),
        correctCount,
        incorrectCount,
        unattemptedCount,
        accuracy,
        timeConsumedSeconds,
      },
    }
  }
}
