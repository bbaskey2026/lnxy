import { JsonRepository } from './JsonRepository.js'

export class QuestionRepository extends JsonRepository {
  constructor(database) {
    super(database, 'questions')
  }
}
