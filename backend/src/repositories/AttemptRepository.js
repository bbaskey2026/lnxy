import { JsonRepository } from './JsonRepository.js'

export class AttemptRepository extends JsonRepository {
  constructor(database) {
    super(database, 'attempts')
  }
}
