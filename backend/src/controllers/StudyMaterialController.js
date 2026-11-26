import { paginate } from '../utils/pagination.js'

export class StudyMaterialController {
  constructor(studyMaterialService) {
    this.service = studyMaterialService
  }

  list = async (req, res) => {
    const result = await this.service.list(req.validatedQuery ?? {})
    if (req.query.page || req.query.limit) {
      const paginated = paginate(result, req.query.page, req.query.limit)
      return res.status(200).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'Study materials fetched successfully',
        data: { items: paginated.items, meta: paginated.meta },
      })
    }

    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Study materials fetched successfully',
      data: result,
    })
  }

  getById = async (req, res) => {
    const data = await this.service.getById(req.params.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Study material fetched successfully',
      data,
    })
  }

  create = async (req, res) => {
    const data = await this.service.create(req.validatedBody)
    return res.status(201).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Study material created successfully',
      data,
    })
  }

  update = async (req, res) => {
    const data = await this.service.update(req.params.id, req.validatedBody)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Study material updated successfully',
      data,
    })
  }

  delete = async (req, res) => {
    await this.service.delete(req.params.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Study material deleted successfully',
      data: { message: 'Study material deleted successfully' },
    })
  }
}
