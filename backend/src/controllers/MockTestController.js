import { CrudController } from './CrudController.js'
export class MockTestController extends CrudController {
  constructor(mockTestService) { super(mockTestService) }
}
