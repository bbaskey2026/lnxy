import { UserModel } from '../../models/UserModel.js'
import { ApiError } from '../../utils/ApiError.js'

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async list() {
    return (await this.userRepository.findAll()).map(UserModel.normalize)
  }

  async getById(id) {
    const user = await this.userRepository.findById(id)
    if (!user) throw new ApiError('User not found', 404, 'NOT_FOUND')
    return UserModel.normalize(user)
  }

  async update(id, dto) {
    await this.getById(id)
    return UserModel.normalize(await this.userRepository.update(id, dto))
  }

  async delete(id) {
    await this.getById(id)
    await this.userRepository.delete(id)
  }
}
