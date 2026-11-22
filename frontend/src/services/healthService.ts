
import API from './api'

export interface HealthResponse {
  status: string
  message: string
  application: string
}

export const checkBackendHealth = async (): Promise<HealthResponse> => {
  const response = await API.get<HealthResponse>('/health')
  return response.data
}
