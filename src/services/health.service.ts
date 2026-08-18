import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type { HealthCheck } from '@/domain/types/health.types'

export const healthService = {
  async check(): Promise<HealthCheck> {
    const { data } = await api.get<HealthCheck>(ENDPOINTS.HEALTH)
    return data
  },
}
