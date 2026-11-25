import { config } from '../config'

const apiBaseUrl = config.apiBaseUrl.replace(/\/+$/, '')

export const getBackendPreviewUrl = (imageName) => (
  `${apiBaseUrl}/assets/previews/${encodeURIComponent(imageName)}`
)
