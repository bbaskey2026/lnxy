import { paginate } from '../../utils/pagination.js'

export class ExamController {
  constructor(examService) {
    this.service = examService
  }

  list = async (req, res) => {
    const result = await this.service.list(req.validatedQuery ?? {})
    if (req.query.page || req.query.limit) {
      const paginated = paginate(result, req.query.page, req.query.limit)
      return res.status(200).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'Examinations fetched successfully',
        data: { items: paginated.items, meta: paginated.meta },
      })
    }

    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Examinations fetched successfully',
      data: result,
    })
  }

  getById = async (req, res) => {
    const data = await this.service.getById(req.params.examId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Examination fetched successfully',
      data,
    })
  }

  create = async (req, res) => {
    const data = await this.service.create(req.validatedBody)
    return res.status(201).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Examination created successfully',
      data,
    })
  }

  update = async (req, res) => {
    const data = await this.service.update(req.params.examId, req.validatedBody)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Examination updated successfully',
      data,
    })
  }

  delete = async (req, res) => {
    await this.service.delete(req.params.examId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Examination deleted successfully',
      data: { message: 'Examination deleted successfully' },
    })
  }
}
