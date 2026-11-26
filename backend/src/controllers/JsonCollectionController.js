export class JsonCollectionController {
  constructor(database, collection) {
    this.database = database
    this.collection = collection
  }

  list = async (_req, res) => {
    const collectionName = this.collection.replace(/-/g, ' ')
    const data = await this.database.read(this.collection)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: `${collectionName} fetched successfully`,
      data,
    })
  }
}
