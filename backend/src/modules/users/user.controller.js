import { ApiError } from '../../utils/ApiError.js'

export class UserController {
  constructor(userService) {
    this.userService = userService
  }

  list = async (req, res) => {
    const data = await this.userService.list()
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Users fetched successfully',
      data,
    })
  }

  getById = async (req, res) => {
    this.assertCanAccessUser(req, req.params.userId)
    const data = await this.userService.getById(req.params.userId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'User fetched successfully',
      data,
    })
  }

  update = async (req, res) => {
    this.assertCanAccessUser(req, req.params.userId)
    if (
      req.user.role !== 'admin'
      && (Object.hasOwn(req.validatedBody, 'role') || Object.hasOwn(req.validatedBody, 'status'))
    ) {
      throw new ApiError('Only administrators can change user roles or status', 403, 'AUTHORIZATION_ERROR')
    }
    const data = await this.userService.update(req.params.userId, req.validatedBody)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'User updated successfully',
      data,
    })
  }

  delete = async (req, res) => {
    await this.userService.delete(req.params.userId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'User deleted successfully',
      data: { message: 'User deleted successfully' },
    })
  }

  assertCanAccessUser(req, userId) {
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      throw new ApiError('You can only access your own account', 403, 'AUTHORIZATION_ERROR')
    }
  }
}
