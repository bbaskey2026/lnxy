import { JsonRepository } from './JsonRepository.js'

export class ExamRepository extends JsonRepository {
  constructor(database) {
    super(database, 'exams')
  }
}
