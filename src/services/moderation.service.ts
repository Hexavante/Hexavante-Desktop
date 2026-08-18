import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  ModerationUser,
  ModerationStats,
  ModerationActionRequest,
} from '@/domain/types/moderation.types'

export const moderationService = {
  async getStats(): Promise<ModerationStats> {
    const { data } = await api.get<{ stats: ModerationStats }>(ENDPOINTS.MODERATION.STATS)
    return data.stats
  },

  async listUsers(params?: {
    search?: string
    status?: string
    role?: string
    limit?: number
  }): Promise<ModerationUser[]> {
    const { data } = await api.get<{ users: ModerationUser[] }>(ENDPOINTS.MODERATION.USERS, {
      params,
    })
    return data.users
  },

  async ban(userId: string, body: ModerationActionRequest): Promise<void> {
    await api.post(ENDPOINTS.MODERATION.BAN(userId), body)
  },

  async unban(userId: string): Promise<void> {
    await api.post(ENDPOINTS.MODERATION.UNBAN(userId))
  },

  async mute(userId: string, body: ModerationActionRequest): Promise<void> {
    await api.post(ENDPOINTS.MODERATION.MUTE(userId), body)
  },

  async unmute(userId: string): Promise<void> {
    await api.post(ENDPOINTS.MODERATION.UNMUTE(userId))
  },

  async warn(userId: string, body: ModerationActionRequest): Promise<void> {
    await api.post(ENDPOINTS.MODERATION.WARN(userId), body)
  },
}