import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.string().url().default('http://localhost:4000'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  PERSISTENCE: z.enum(['json', 'postgres', 'mongodb']).default('json'),
  AUTH_PERSISTENCE: z.enum(['mongodb', 'memory']).default('mongodb'),
  MONGODB_URI: z.string().regex(/^mongodb(\+srv)?:\/\//).optional(),
  MONGODB_DATABASE: z.string().trim().min(1).default('exampro'),
  JSON_DATA_DIRECTORY: z.string().default('./src/database/json/data'),
  JWT_ACCESS_SECRET: z.string().min(32).default('development-access-secret-change-me-123456789'),
  JWT_REFRESH_SECRET: z.string().min(32).default('development-refresh-secret-change-me-123456789'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().regex(/^\d+[smhd]$/).default('7d'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false'),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

if (parsed.data.NODE_ENV === 'production') {
  if (parsed.data.AUTH_PERSISTENCE !== 'mongodb') {
    throw new Error('Production requires AUTH_PERSISTENCE=mongodb.')
  }
  const defaultSecrets = [
    'development-access-secret-change-me-123456789',
    'development-refresh-secret-change-me-123456789',
    'change-this-to-a-long-random-access-secret',
    'change-this-to-a-long-random-refresh-secret',
  ]
  if (
    defaultSecrets.includes(parsed.data.JWT_ACCESS_SECRET)
    || defaultSecrets.includes(parsed.data.JWT_REFRESH_SECRET)
    || parsed.data.JWT_ACCESS_SECRET === parsed.data.JWT_REFRESH_SECRET
  ) {
    throw new Error('Production requires unique JWT secrets configured through the environment.')
  }
  if (parsed.data.COOKIE_SECURE !== 'true') {
    throw new Error('COOKIE_SECURE=true is required in production.')
  }
  if (!parsed.data.MONGODB_URI) {
    throw new Error('MONGODB_URI is required in production.')
  }
}

export const env = Object.freeze({
  ...parsed.data,
  cookieSecure: parsed.data.COOKIE_SECURE === 'true',
})
