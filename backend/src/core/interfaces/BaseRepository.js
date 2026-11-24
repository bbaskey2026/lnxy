export class BaseRepository {
  async findById() {
    throw new Error('findById() must be implemented')
  }

  async findAll() {
    throw new Error('findAll() must be implemented')
  }

  async create() {
    throw new Error('create() must be implemented')
  }

  async update() {
    throw new Error('update() must be implemented')
  }

  async delete() {
    throw new Error('delete() must be implemented')
  }
}
