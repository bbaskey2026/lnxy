import { JsonRepository } from '../../repositories/JsonRepository.js'

export class CourseRepository extends JsonRepository {
  constructor(database) {
    super(database, 'courses')
  }
}
