import { ApiResponse } from '../../../core/responses/ApiResponse.js'

export class UserController {
  constructor({ userRepository }) {
    this.userRepository = userRepository
  }

  list = async (req, res) => {
    const users = await this.userRepository.findAll()
    const safeUsers = users.map(({ passwordHash, refreshTokens, ...user }) => user)
    res.json(ApiResponse.success(safeUsers))
  }
}
