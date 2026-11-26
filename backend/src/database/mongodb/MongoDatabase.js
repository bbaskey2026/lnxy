import mongoose from 'mongoose'
import { env } from '../../config/env.js'
import { PurchaseSchema } from './schemas/Purchase.schema.js'
import { RefreshTokenSchema } from './schemas/RefreshToken.schema.js'
import { SubscriptionSchema } from './schemas/Subscription.schema.js'
import { UserSchema } from './schemas/User.schema.js'

export class MongoDatabase {
  constructor({ logger }) {
    if (!env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required for authentication persistence.')
    }

    this.logger = logger
    this.connection = null
    this.models = null
  }

  async initialize() {
    try {
      this.connection = mongoose.createConnection(env.MONGODB_URI, {
        dbName: env.MONGODB_DATABASE,
        appName: 'exampro-backend',
        maxPoolSize: 10,
        minPoolSize: 0,
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        ...(env.NODE_ENV === 'production' ? { tls: true } : {}),
      })
      await this.connection.asPromise()
      this.models = {
        User: this.connection.model('User', UserSchema, 'users'),
        RefreshToken: this.connection.model('RefreshToken', RefreshTokenSchema, 'refresh_tokens'),
        Purchase: this.connection.model('Purchase', PurchaseSchema, 'purchases'),
        Subscription: this.connection.model('Subscription', SubscriptionSchema, 'subscriptions'),
      }
      await Promise.all([
        this.models.User.init(),
        this.models.RefreshToken.init(),
        this.models.Purchase.init(),
        this.models.Subscription.init(),
      ])
      this.logger.info({ event: 'mongodb.ready', database: env.MONGODB_DATABASE }, 'MongoDB authentication persistence ready')
    } catch (error) {
      await this.close()
      throw error
    }

    return this
  }

  getModels() {
    if (!this.models) {
      throw new Error('MongoDB is not initialized.')
    }
    return this.models
  }

  async close() {
    if (this.connection) await this.connection.close()
    this.connection = null
    this.models = null
  }
}
