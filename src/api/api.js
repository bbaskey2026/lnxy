import { axiosClient } from './axiosClient'

export function unwrapResponse(response) {
  return response.data?.data ?? response.data
}

export const api = {
  get: async (url, config) => unwrapResponse(await axiosClient.get(url, config)),
  post: async (url, body, config) => unwrapResponse(await axiosClient.post(url, body, config)),
  put: async (url, body, config) => unwrapResponse(await axiosClient.put(url, body, config)),
  patch: async (url, body, config) => unwrapResponse(await axiosClient.patch(url, body, config)),
  delete: async (url, config) => unwrapResponse(await axiosClient.delete(url, config)),
}
