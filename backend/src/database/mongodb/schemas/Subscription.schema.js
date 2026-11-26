import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'

const isSafeInteger = (value) => Number.isSafeInteger(value)

export const SubscriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, immutable: true, default: () => randomUUID() },
  studentId: { type: String, required: true, trim: true },
  purchaseId: { type: String, default: null, trim: true },
  productId: { type: String, required: true, trim: true },
  productType: {
    type: String,
    required: true,
    trim: true,
    enum: ['mocktest', 'courses', 'topic'],
  },
  mockTestType: {
    type: String,
    enum: ['full', 'sectional', 'topic'],
    required() {
      return this.productType === 'mocktest'
    },
  },
  planId: { type: String, required: true, trim: true },
  planName: { type: String, required: true, trim: true, maxlength: 200 },
  amountMinor: {
    type: Number,
    required: true,
    min: 0,
    validate: { validator: isSafeInteger, message: 'Amount must be a whole number of minor currency units.' },
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{3}$/,
  },
  billingInterval: {
    type: String,
    enum: ['day', 'week', 'month', 'year'],
    required: true,
  },
  intervalCount: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
    validate: { validator: isSafeInteger, message: 'Billing interval count must be a whole number.' },
  },
  status: {
    type: String,
    enum: ['pending', 'trialing', 'active', 'past_due', 'paused', 'cancelled', 'expired', 'incomplete'],
    required: true,
    default: 'pending',
  },
  paymentProvider: { type: String, trim: true, maxlength: 80 },
  providerSubscriptionId: { type: String, trim: true, maxlength: 200 },
  currentPeriodStart: { type: Date, default: null },
  currentPeriodEnd: { type: Date, default: null },
  trialStart: { type: Date, default: null },
  trialEnd: { type: Date, default: null },
  startedAt: { type: Date, default: null },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  cancelledAt: { type: Date, default: null },
  endedAt: { type: Date, default: null },
}, {
  collection: 'subscriptions',
  id: false,
  versionKey: false,
  timestamps: true,
})

SubscriptionSchema.index({ id: 1 }, { unique: true, name: 'subscriptions_id_unique' })
SubscriptionSchema.index(
  { studentId: 1, status: 1 },
  { name: 'subscriptions_student_status' },
)
SubscriptionSchema.index(
  { studentId: 1, createdAt: -1 },
  { name: 'subscriptions_student_created' },
)
SubscriptionSchema.index(
  { paymentProvider: 1, providerSubscriptionId: 1 },
  {
    unique: true,
    partialFilterExpression: { providerSubscriptionId: { $type: 'string' } },
    name: 'subscriptions_provider_id_unique',
  },
)

SubscriptionSchema.virtual('student', {
  ref: 'User',
  localField: 'studentId',
  foreignField: 'id',
  justOne: true,
})
