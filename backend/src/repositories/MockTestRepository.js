import { JsonRepository } from './JsonRepository.js'

export class MockTestRepository extends JsonRepository {
  constructor(database) {
    super(database, 'mock-tests')
  }
}
