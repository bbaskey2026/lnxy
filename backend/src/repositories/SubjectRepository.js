import { JsonRepository } from './JsonRepository.js'

export class SubjectRepository extends JsonRepository {
  constructor(database) {
    super(database, 'subjects')
  }
}
