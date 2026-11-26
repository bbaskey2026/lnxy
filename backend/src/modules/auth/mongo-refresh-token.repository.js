export class MongoRefreshTokenRepository {
  constructor(database) {
    this.RefreshToken = database.getModels().RefreshToken
  }

  async create(record) {
    await this.RefreshToken.create({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      expiresAt: record.expiresAt,
      revoked: false,
      createdAt: record.createdAt,
    })
  }

  async consumeByHash(tokenHash) {
    const record = await this.RefreshToken.findOneAndUpdate(
      {
        tokenHash,
        revoked: false,
        expiresAt: { $gt: new Date() },
      },
      {
        $set: { revoked: true, revokedAt: new Date() },
      },
      { returnDocument: 'before' },
    ).lean().exec()
    if (!record) return null
    const { _id, __v, ...token } = record
    return token
  }

  async revokeByHash(tokenHash) {
    await this.RefreshToken.updateOne(
      { tokenHash, revoked: false },
      { $set: { revoked: true, revokedAt: new Date() } },
    ).exec()
  }
}
