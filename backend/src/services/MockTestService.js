import { CrudService } from './CrudService.js'
import { MockTestModel } from '../models/MockTestModel.js'

export class MockTestService extends CrudService {
  constructor(mockTestRepository) {
    super(mockTestRepository, MockTestModel, 'Mock test')
  }
}
