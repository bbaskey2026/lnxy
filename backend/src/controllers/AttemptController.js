import { ApiResponse } from '../utils/ApiResponse.js'

export class AttemptController {
  constructor(attemptService) {
    this.attemptService = attemptService
  }

  start = async (req, res) => res.status(201).json(ApiResponse.success(await this.attemptService.start(req.user.id, req.validatedBody.mockTestId)))
  saveAnswer = async (req, res) => res.json(ApiResponse.success(await this.attemptService.saveAnswer(req.user.id, req.params.attemptId, req.validatedBody)))
  submit = async (req, res) => res.json(ApiResponse.success(await this.attemptService.submit(req.user.id, req.params.attemptId)))
}
