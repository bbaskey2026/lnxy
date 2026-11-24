import { JsonRepository } from './JsonRepository.js'

export class TopicRepository extends JsonRepository {
  constructor(database) {
    super(database, 'topics')
  }
}
