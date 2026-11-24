import { JsonRepository } from './JsonRepository.js'

export class ResultRepository extends JsonRepository {
  constructor(database) {
    super(database, 'results')
  }
}
