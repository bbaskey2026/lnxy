import { JsonRepository } from './JsonRepository.js'

export class LectureRepository extends JsonRepository {
  constructor(database) {
    super(database, 'lectures')
  }
}
