import { JsonRepository } from './JsonRepository.js'

export class CourseRepository extends JsonRepository {
  constructor(database) {
    super(database, 'courses')
  }
}
