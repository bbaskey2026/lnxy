import { paginate } from '../../utils/pagination.js'

export class CourseController {
  constructor(courseService, enrollmentService) {
    this.service = courseService
    this.enrollmentService = enrollmentService
  }

  list = async (req, res) => {
    const result = await this.service.list(req.validatedQuery ?? {})
    if (req.query.page || req.query.limit) {
      const paginated = paginate(result, req.query.page, req.query.limit)
      return res.status(200).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'Courses fetched successfully',
        data: { items: paginated.items, meta: paginated.meta },
      })
    }

    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Courses fetched successfully',
      data: result,
    })
  }

  getById = async (req, res) => {
    const data = await this.service.getById(req.params.courseId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Course fetched successfully',
      data,
    })
  }

  create = async (req, res) => {
    const data = await this.service.create(req.validatedBody)
    return res.status(201).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Course created successfully',
      data,
    })
  }

  update = async (req, res) => {
    const data = await this.service.update(req.params.courseId, req.validatedBody)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Course updated successfully',
      data,
    })
  }

  delete = async (req, res) => {
    await this.service.delete(req.params.courseId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Course deleted successfully',
      data: { message: 'Course deleted successfully' },
    })
  }

  listEnrolled = async (req, res) => {
    const data = await this.enrollmentService.listForUser(req.user.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Enrolled courses fetched successfully',
      data,
    })
  }

  enroll = async (req, res) => {
    const data = await this.enrollmentService.enroll(req.user.id, req.params.courseId)
    return res.status(201).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Course enrollment successful',
      data,
    })
  }
}
