import { ApiResponse } from '../utils/ApiResponse.js'

export class JsonCollectionController {
  constructor(database, collection) {
    this.database = database
    this.collection = collection
  }

  list = async (_req, res) => {
    res.json(ApiResponse.success(await this.database.read(this.collection)))
  }
}
