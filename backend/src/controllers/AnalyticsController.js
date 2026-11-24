import { ApiResponse } from '../utils/ApiResponse.js'

export class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService
  }

  getMe = async (req, res) => res.json(ApiResponse.success(await this.analyticsService.getForUser(req.user.id)))
}
