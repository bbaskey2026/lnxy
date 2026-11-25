import { api } from '../api/api'

export function createCrudService(resourceEndpoint) {
  return {
    list(params) {
      return api.get(resourceEndpoint.list, { params })
    },
    getById(id) {
      return api.get(resourceEndpoint.byId(id))
    },
    create(body) {
      return api.post(resourceEndpoint.list, body)
    },
    update(id, body) {
      return api.patch(resourceEndpoint.byId(id), body)
    },
    delete(id) {
      return api.delete(resourceEndpoint.byId(id))
    },
  }
}
