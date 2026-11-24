import { ApiResponse } from '../utils/ApiResponse.js'
import { paginate } from '../utils/pagination.js'

export class CrudController {
  constructor(service) {
    this.service = service
  }

  list = async (req, res) => {
    const result = await this.service.list(req.validatedQuery ?? {})
    if (req.query.page || req.query.limit) {
      const paginated = paginate(result, req.query.page, req.query.limit)
      res.json(ApiResponse.success(paginated.items, paginated.meta))
    } else {
      res.json(ApiResponse.success(result))
    }
  }

  getById = async (req, res) => {
    const id = req.params.id ?? req.params.examId ?? req.params.courseId ?? req.params.lectureId
    res.json(ApiResponse.success(await this.service.getById(id)))
  }

  create = async (req, res) => {
    res.status(201).json(ApiResponse.success(await this.service.create(req.validatedBody)))
  }

  update = async (req, res) => {
    const id = req.params.id ?? req.params.examId ?? req.params.courseId ?? req.params.lectureId
    res.json(ApiResponse.success(await this.service.update(id, req.validatedBody)))
  }

  delete = async (req, res) => {
    const id = req.params.id ?? req.params.examId ?? req.params.courseId ?? req.params.lectureId
    await this.service.delete(id)
    res.json(ApiResponse.message('Deleted successfully'))
  }
}
