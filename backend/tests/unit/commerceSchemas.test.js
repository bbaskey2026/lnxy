import assert from 'node:assert/strict'
import test from 'node:test'
import { PurchaseSchema } from '../../src/database/mongodb/schemas/Purchase.schema.js'
import { SubscriptionSchema } from '../../src/database/mongodb/schemas/Subscription.schema.js'
import { createMockTestFixtures } from '../../scripts/mockTestFixtures.js'

test('purchase schema records student, item, amount, status, and provider references', () => {
  assert.ok(PurchaseSchema.path('studentId'))
  assert.ok(PurchaseSchema.path('items'))
  assert.ok(PurchaseSchema.path('totalAmountMinor'))
  assert.deepEqual(PurchaseSchema.path('items').schema.path('productType').enumValues, [
    'mocktest',
    'courses',
    'topic',
  ])
  assert.deepEqual(PurchaseSchema.path('items').schema.path('mockTestType').enumValues, [
    'full',
    'sectional',
    'topic',
  ])
  assert.equal(
    PurchaseSchema.path('items').schema.path('mockTestType').options.required.call({ productType: 'mocktest' }),
    true,
  )
  assert.equal(
    PurchaseSchema.path('items').schema.path('mockTestType').options.required.call({ productType: 'courses' }),
    false,
  )
  assert.deepEqual(PurchaseSchema.path('status').enumValues, [
    'pending',
    'paid',
    'failed',
    'cancelled',
    'partially_refunded',
    'refunded',
  ])
  assert.ok(PurchaseSchema.indexes().some(([fields]) => (
    fields.studentId === 1 && fields.createdAt === -1
  )))
})

test('subscription schema records billing lifecycle and indexes student lookups', () => {
  assert.deepEqual(SubscriptionSchema.path('productType').enumValues, [
    'mocktest',
    'courses',
    'topic',
  ])
  assert.deepEqual(SubscriptionSchema.path('mockTestType').enumValues, [
    'full',
    'sectional',
    'topic',
  ])
  assert.equal(
    SubscriptionSchema.path('mockTestType').options.required.call({ productType: 'mocktest' }),
    true,
  )
  assert.ok(SubscriptionSchema.path('currentPeriodStart'))
  assert.ok(SubscriptionSchema.path('currentPeriodEnd'))
  assert.ok(SubscriptionSchema.path('cancelAtPeriodEnd'))
  assert.deepEqual(SubscriptionSchema.path('billingInterval').enumValues, [
    'day',
    'week',
    'month',
    'year',
  ])
  assert.ok(SubscriptionSchema.indexes().some(([fields]) => (
    fields.studentId === 1 && fields.status === 1
  )))
})

test('mock-test fixtures cover full, sectional, and topic types', () => {
  const { mockTests } = createMockTestFixtures([
    { id: 'exam-1', slug: 'ssc-cgl' },
    { id: 'exam-2', slug: 'osssc-ri' },
  ])
  assert.deepEqual(mockTests.map((mockTest) => mockTest.mockTestType), [
    'full',
    'sectional',
    'topic',
  ])
})
