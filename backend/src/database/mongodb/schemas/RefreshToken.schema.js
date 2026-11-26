import mongoose from 'mongoose'

export const RefreshTokenSchema = new mongoose.Schema({
  id: { type: String, required: true, immutable: true },
  userId: { type: String, required: true, index: true },
  tokenHash: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, required: true, default: false },
  revokedAt: { type: Date, default: null },
  createdAt: { type: String, required: true },
}, {
  collection: 'refresh_tokens',
  id: false,
  versionKey: false,
})

RefreshTokenSchema.index(
  { tokenHash: 1 },
  { unique: true, name: 'refresh_tokens_hash_unique' },
)
RefreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'refresh_tokens_expiry_ttl' },
)
