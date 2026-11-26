export class AttemptController {
  constructor(attemptService) {
    this.attemptService = attemptService
  }

  start = async (req, res) => {
    const data = await this.attemptService.start(req.user.id, req.validatedBody.mockTestId)
    return res.status(201).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Attempt started successfully',
      data,
    })
  }

  saveAnswer = async (req, res) => {
    const data = await this.attemptService.saveAnswer(req.user.id, req.params.attemptId, req.validatedBody)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Answer saved successfully',
      data,
    })
  }

  submit = async (req, res) => {
    const data = await this.attemptService.submit(req.user.id, req.params.attemptId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Attempt submitted successfully',
      data,
    })
  }
}
