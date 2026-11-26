import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'

const isSafeInteger = (value) => Number.isSafeInteger(value)

const purchaseItemSchema = new mongoose.Schema({
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
  productName: { type: String, required: true, trim: true, maxlength: 200 },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: { validator: isSafeInteger, message: 'Quantity must be a whole number.' },
  },
  unitAmountMinor: {
    type: Number,
    required: true,
    min: 0,
    validate: { validator: isSafeInteger, message: 'Amount must be a whole number of minor currency units.' },
  },
}, {
  _id: false,
  id: false,
  versionKey: false,
})

const paymentSchema = new mongoose.Schema({
  provider: { type: String, trim: true, maxlength: 80 },
  providerPaymentId: { type: String, trim: true, maxlength: 200 },
  method: { type: String, trim: true, maxlength: 80 },
  failureCode: { type: String, trim: true, maxlength: 100 },
}, {
  _id: false,
  id: false,
  versionKey: false,
})

export const PurchaseSchema = new mongoose.Schema({
  id: { type: String, required: true, immutable: true, default: () => randomUUID() },
  studentId: { type: String, required: true, trim: true },
  items: {
    type: [purchaseItemSchema],
    required: true,
    default: undefined,
    validate: {
      validator: (items) => Array.isArray(items) && items.length > 0,
      message: 'A purchase must contain at least one item.',
    },
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{3}$/,
  },
  subtotalAmountMinor: {
    type: Number,
    required: true,
    min: 0,
    validate: { validator: isSafeInteger, message: 'Subtotal must be a whole number of minor currency units.' },
  },
  discountAmountMinor: {
    type: Number,
    default: 0,
    min: 0,
    validate: { validator: isSafeInteger, message: 'Discount must be a whole number of minor currency units.' },
  },
  taxAmountMinor: {
    type: Number,
    default: 0,
    min: 0,
    validate: { validator: isSafeInteger, message: 'Tax must be a whole number of minor currency units.' },
  },
  totalAmountMinor: {
    type: Number,
    required: true,
    min: 0,
    validate: { validator: isSafeInteger, message: 'Total must be a whole number of minor currency units.' },
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled', 'partially_refunded', 'refunded'],
    required: true,
    default: 'pending',
  },
  payment: { type: paymentSchema, default: () => ({}) },
  subscriptionId: { type: String, default: null, trim: true },
  paidAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  refundedAt: { type: Date, default: null },
}, {
  collection: 'purchases',
  id: false,
  versionKey: false,
  timestamps: true,
})

PurchaseSchema.index({ id: 1 }, { unique: true, name: 'purchases_id_unique' })
PurchaseSchema.index({ studentId: 1, createdAt: -1 }, { name: 'purchases_student_created' })
PurchaseSchema.index({ status: 1, createdAt: -1 }, { name: 'purchases_status_created' })
PurchaseSchema.index(
  { 'payment.provider': 1, 'payment.providerPaymentId': 1 },
  {
    unique: true,
    partialFilterExpression: { 'payment.providerPaymentId': { $type: 'string' } },
    name: 'purchases_provider_payment_unique',
  },
)

PurchaseSchema.virtual('student', {
  ref: 'User',
  localField: 'studentId',
  foreignField: 'id',
  justOne: true,
})
