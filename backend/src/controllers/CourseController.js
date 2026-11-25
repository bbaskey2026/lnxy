import { CrudController } from './CrudController.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export class CourseController extends CrudController {
  constructor(courseService, enrollmentService) {
    super(courseService)
    this.enrollmentService = enrollmentService
  }

  listEnrolled = async (req, res) => {
    const enrollments = await this.enrollmentService.listForUser(req.user.id)
    res.json(ApiResponse.success(enrollments))
  }

  enroll = async (req, res) => {
    const enrollment = await this.enrollmentService.enroll(req.user.id, req.params.courseId)
    res.status(201).json(ApiResponse.success(enrollment))
  }
}
