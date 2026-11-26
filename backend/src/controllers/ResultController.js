export class ResultController {
  constructor(resultService) {
    this.resultService = resultService
  }

  list = async (req, res) => {
    const data = await this.resultService.listForUser(req.user.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Results fetched successfully',
      data,
    })
  }

  getByAttempt = async (req, res) => {
    const data = await this.resultService.getByAttempt(req.params.attemptId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Result fetched successfully',
      data,
    })
  }
}
