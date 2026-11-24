import { JsonRepository } from './JsonRepository.js'

export class StudyMaterialRepository extends JsonRepository {
  constructor(database) {
    super(database, 'materials')
  }
}
