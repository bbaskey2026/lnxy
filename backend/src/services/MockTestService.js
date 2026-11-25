import { CrudService } from './CrudService.js'
import { MockTestModel } from '../models/MockTestModel.js'
import { ApiError } from '../utils/ApiError.js'

export class MockTestService extends CrudService {
  constructor(mockTestRepository, questionRepository, examRepository) {
    super(mockTestRepository, MockTestModel, 'Mock test')
    this.questionRepository = questionRepository
    this.examRepository = examRepository
  }

  async list(filters = {}) {
    const tests = (await super.list(filters)).filter((test) => test.isActive)
    const exams = await this.examRepository.findAll()
    const examsById = new Map(exams.map((exam) => [exam.id, exam]))

    return tests.map((test) => ({
      ...test,
      examination: examsById.get(test.examId)?.name ?? 'General',
      questionCount: (test.questionIds ?? []).length,
    }))
  }

  async getById(id) {
    const test = await super.getById(id)
    if (!test.isActive) throw new ApiError('Mock test not found', 404, 'NOT_FOUND')
    const [hydratedTest] = await this.attachQuestions([test])
    return hydratedTest
  }

  async attachQuestions(tests) {
    const [questions, exams] = await Promise.all([
      this.questionRepository.findAll(),
      this.examRepository.findAll(),
    ])
    const questionsById = new Map(questions.map((question) => [question.id, question]))
    const examsById = new Map(exams.map((exam) => [exam.id, exam]))

    return tests.map((test) => ({
      ...test,
      examination: examsById.get(test.examId)?.name ?? 'General',
      questions: (test.questionIds ?? []).map((questionId) => {
        const question = questionsById.get(questionId)
        if (!question) {
          throw new ApiError(`Mock test "${test.title}" references a missing question`, 500, 'DATA_INTEGRITY_ERROR')
        }
        return {
          id: question.id,
          subject: question.subject ?? 'General',
          text: question.text,
          options: question.options,
          correctIndex: question.correctOptionIndex,
          explanation: question.explanation,
        }
      }),
    }))
  }
}
