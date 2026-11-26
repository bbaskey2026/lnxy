import { paginate } from '../utils/pagination.js'

export class TopicController {
  constructor(topicService) {
    this.service = topicService
  }

  list = async (req, res) => {
    const result = await this.service.list(req.validatedQuery ?? {})
    if (req.query.page || req.query.limit) {
      const paginated = paginate(result, req.query.page, req.query.limit)
      return res.status(200).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'Topics fetched successfully',
        data: { items: paginated.items, meta: paginated.meta },
      })
    }

    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Topics fetched successfully',
      data: result,
    })
  }

  getById = async (req, res) => {
    const data = await this.service.getById(req.params.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Topic fetched successfully',
      data,
    })
  }

  create = async (req, res) => {
    const data = await this.service.create(req.validatedBody)
    return res.status(201).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Topic created successfully',
      data,
    })
  }

  update = async (req, res) => {
    const data = await this.service.update(req.params.id, req.validatedBody)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Topic updated successfully',
      data,
    })
  }

  delete = async (req, res) => {
    await this.service.delete(req.params.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Topic deleted successfully',
      data: { message: 'Topic deleted successfully' },
    })
  }
}
