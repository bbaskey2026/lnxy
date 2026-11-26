import { env } from './env.js'
import { JsonDatabase } from '../database/json/JsonDatabase.js'

export function createDatabase() {
  if (env.PERSISTENCE !== 'json') {
    throw new Error(
      `Database adapter "${env.PERSISTENCE}" is not initialized. PERSISTENCE=json is currently supported.`,
    )
  }
  return new JsonDatabase(env.JSON_DATA_DIRECTORY)
}
