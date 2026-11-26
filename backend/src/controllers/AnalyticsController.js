export class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService
  }

  getMe = async (req, res) => {
    const data = await this.analyticsService.getForUser(req.user.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Analytics fetched successfully',
      data,
    })
  }
}
