import { ApiError } from '../utils/ApiError.js'

export class CrudService {
  constructor(repository, model, resourceName = 'Resource') {
    this.repository = repository
    this.model = model
    this.resourceName = resourceName
  }

  async list(filters = {}) {
    return this.repository.findAll(filters)
  }

  async getById(id) {
    const record = await this.repository.findById(id)
    if (!record) throw new ApiError(`${this.resourceName} not found`, 404, 'NOT_FOUND')
    return record
  }

  async create(dto) {
    return this.repository.create(this.model.create(dto))
  }

  async update(id, dto) {
    await this.getById(id)
    const updated = await this.repository.update(id, dto)
    if (!updated) throw new ApiError(`${this.resourceName} not found`, 404, 'NOT_FOUND')
    return updated
  }

  async delete(id) {
    await this.getById(id)
    await this.repository.delete(id)
  }
}
