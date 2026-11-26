import mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, immutable: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
  status: { type: String, enum: ['active', 'suspended'], required: true },
  targetExam: { type: String, default: null, maxlength: 150 },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, {
  collection: 'users',
  id: false,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

UserSchema.index({ id: 1 }, { unique: true, name: 'users_id_unique' })
UserSchema.index({ email: 1 }, { unique: true, name: 'users_email_unique' })

UserSchema.virtual('purchases', {
  ref: 'Purchase',
  localField: 'id',
  foreignField: 'studentId',
})
UserSchema.virtual('subscriptions', {
  ref: 'Subscription',
  localField: 'id',
  foreignField: 'studentId',
})
