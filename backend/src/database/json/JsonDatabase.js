import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export class JsonDatabase {
  constructor(directory) {
    this.directory = path.resolve(process.cwd(), directory)
  }

  async initialize() {
    await mkdir(this.directory, { recursive: true })
  }

  async read(collection) {
    await this.initialize()
    const filePath = path.join(this.directory, `${collection}.json`)
    try {
      return JSON.parse(await readFile(filePath, 'utf8'))
    } catch (error) {
      if (error.code === 'ENOENT') return []
      throw error
    }
  }

  async write(collection, records) {
    await this.initialize()
    const filePath = path.join(this.directory, `${collection}.json`)
    await writeFile(filePath, JSON.stringify(records, null, 2), 'utf8')
  }
}
