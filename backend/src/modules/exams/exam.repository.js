import { JsonRepository } from '../../repositories/JsonRepository.js'

export class ExamRepository extends JsonRepository {
  constructor(database) {
    super(database, 'exams')
  }
}
