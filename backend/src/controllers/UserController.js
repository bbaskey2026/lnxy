import { ApiResponse } from '../utils/ApiResponse.js'

export class UserController {
  constructor(userService) {
    this.userService = userService
  }

  list = async (req, res) => res.json(ApiResponse.success(await this.userService.list()))
  getById = async (req, res) => res.json(ApiResponse.success(await this.userService.getById(req.params.userId)))
  update = async (req, res) => res.json(ApiResponse.success(await this.userService.update(req.params.userId, req.validatedBody)))
  delete = async (req, res) => {
    await this.userService.delete(req.params.userId)
    res.json(ApiResponse.message('User deleted successfully'))
  }
}
