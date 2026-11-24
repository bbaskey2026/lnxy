import { ApiResponse } from '../utils/ApiResponse.js'

export class ResultController {
  constructor(resultService) {
    this.resultService = resultService
  }

  list = async (req, res) => res.json(ApiResponse.success(await this.resultService.listForUser(req.user.id)))
  getByAttempt = async (req, res) => res.json(ApiResponse.success(await this.resultService.getByAttempt(req.params.attemptId)))
}
