import crypto from 'node:crypto'
import { ApiError } from '../utils/ApiError.js'

export class CourseEnrollmentService {
  constructor(courseRepository, database) {
    this.courseRepository = courseRepository
    this.database = database
  }

  async listForUser(userId) {
    const enrollments = await this.database.read('course-enrollments')
    return enrollments.filter((enrollment) => enrollment.userId === userId)
  }

  async enroll(userId, courseId) {
    const course = await this.courseRepository.findById(courseId)
    if (!course || course.isPublished === false) {
      throw new ApiError('Course not found', 404, 'NOT_FOUND')
    }

    const enrollments = await this.database.read('course-enrollments')
    const existing = enrollments.find((enrollment) => enrollment.userId === userId && enrollment.courseId === courseId)
    if (existing) return existing

    const enrollment = {
      id: crypto.randomUUID(),
      userId,
      courseId,
      progress: 0,
      enrolledAt: new Date().toISOString(),
    }
    enrollments.push(enrollment)
    await this.database.write('course-enrollments', enrollments)
    return enrollment
  }
}
