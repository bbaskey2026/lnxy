import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.string().url().default('http://localhost:4000'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  PERSISTENCE: z.enum(['json', 'postgres', 'mongodb']).default('json'),
  JSON_DATA_DIRECTORY: z.string().default('./src/database/json/data'),
  JWT_ACCESS_SECRET: z.string().min(32).default('development-access-secret-change-me-123456789'),
  JWT_REFRESH_SECRET: z.string().min(32).default('development-refresh-secret-change-me-123456789'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false'),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

export const env = Object.freeze({
  ...parsed.data,
  cookieSecure: parsed.data.COOKIE_SECURE === 'true',
})
