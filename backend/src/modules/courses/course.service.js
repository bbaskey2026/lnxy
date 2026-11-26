import { CrudService } from '../../services/CrudService.js'
import { CourseModel } from '../../models/CourseModel.js'

export class CourseService extends CrudService {
  constructor(courseRepository) {
    super(courseRepository, CourseModel, 'Course')
  }
}
