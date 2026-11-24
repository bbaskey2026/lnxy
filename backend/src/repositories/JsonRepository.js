import crypto from 'node:crypto'

export class JsonRepository {
  constructor(database, collection) {
    this.database = database
    this.collection = collection
  }

  async findAll(filters = {}) {
    const records = await this.database.read(this.collection)
    return records.filter((record) => Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true
      return record[key] === value
    }))
  }

  async findById(id) {
    const records = await this.findAll()
    return records.find((record) => record.id === id) ?? null
  }

  async create(record) {
    const records = await this.findAll()
    const created = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...record }
    records.push(created)
    await this.database.write(this.collection, records)
    return created
  }

  async update(id, changes) {
    const records = await this.findAll()
    const index = records.findIndex((record) => record.id === id)
    if (index === -1) return null
    records[index] = { ...records[index], ...changes, updatedAt: new Date().toISOString() }
    await this.database.write(this.collection, records)
    return records[index]
  }

  async delete(id) {
    const records = await this.findAll()
    const remaining = records.filter((record) => record.id !== id)
    if (remaining.length === records.length) return false
    await this.database.write(this.collection, remaining)
    return true
  }

  async replaceAll(records) {
    await this.database.write(this.collection, records)
  }
}
