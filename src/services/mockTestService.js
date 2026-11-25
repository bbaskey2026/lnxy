import { axiosClient } from '../api/axiosClient'

export const mockTestService = {
  async list() {
    try {
      const response = await axiosClient.get('/mock-tests')
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.error?.message ?? 'Unable to load mock tests.')
    }
  },

  async getById(testId) {
    try {
      const response = await axiosClient.get(`/mock-tests/${testId}`)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.error?.message ?? 'Unable to load this mock test.')
    }
  },
}
