import assert from 'node:assert/strict'
import test from 'node:test'
import { PurchaseSchema } from '../../src/database/mongodb/schemas/Purchase.schema.js'
import { RefreshTokenSchema } from '../../src/database/mongodb/schemas/RefreshToken.schema.js'
import { SubscriptionSchema } from '../../src/database/mongodb/schemas/Subscription.schema.js'
import { UserSchema } from '../../src/database/mongodb/schemas/User.schema.js'

test('user schema protects password hashes and enforces unique identity indexes', () => {
  assert.equal(UserSchema.path('passwordHash').options.select, false)
  assert.deepEqual(UserSchema.path('role').enumValues, ['student', 'instructor', 'admin'])
  assert.ok(UserSchema.indexes().some(([fields, options]) => (
    fields.email === 1 && options.unique === true
  )))
})

test('user, purchase, and subscription schemas can populate each other by user id', () => {
  assert.equal(UserSchema.virtuals.purchases.options.ref, 'Purchase')
  assert.equal(UserSchema.virtuals.purchases.options.localField, 'id')
  assert.equal(UserSchema.virtuals.purchases.options.foreignField, 'studentId')
  assert.equal(UserSchema.virtuals.subscriptions.options.ref, 'Subscription')
  assert.equal(PurchaseSchema.virtuals.student.options.foreignField, 'id')
  assert.equal(SubscriptionSchema.virtuals.student.options.foreignField, 'id')
})

test('refresh-token schema hides hashes and expires sessions through a TTL index', () => {
  assert.equal(RefreshTokenSchema.path('tokenHash').options.select, false)
  assert.ok(RefreshTokenSchema.indexes().some(([fields, options]) => (
    fields.expiresAt === 1 && options.expireAfterSeconds === 0
  )))
})
