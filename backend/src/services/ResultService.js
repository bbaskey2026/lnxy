import { ResultModel } from '../models/ResultModel.js'
import { ApiError } from '../utils/ApiError.js'

export class ResultService {
  constructor(resultRepository) {
    this.resultRepository = resultRepository
  }

  async listForUser(userId) {
    return this.resultRepository.findAll({ userId })
  }

  async getByAttempt(attemptId) {
    const result = (await this.resultRepository.findAll()).find((item) => item.attemptId === attemptId)
    if (!result) throw new ApiError('Result not found', 404, 'NOT_FOUND')
    return result
  }

  async create(dto) {
    return this.resultRepository.create(ResultModel.create(dto))
  }
}
