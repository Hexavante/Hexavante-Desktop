import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  RankingEntry,
  MyRanking,
  RankingSeason,
  XpProfile,
  XpTransaction,
  Achievement,
  UserAchievement,
} from '@/domain/types/gamification.types'
import type { PaginatedResponse } from '@/domain/types/api.types'

export const gamificationService = {
  async getXpProfile(): Promise<XpProfile> {
    const { data } = await api.get<XpProfile>(ENDPOINTS.GAMIFICATION.XP_PROFILE)
    return data
  },
  async getRankings(params?: {
    page?: number
    limit?: number
  }): Promise<{ data: RankingEntry[]; pagination: PaginatedResponse<RankingEntry>['pagination']; season: RankingSeason }> {
    const { data } = await api.get<{
      data: RankingEntry[]
      pagination: PaginatedResponse<RankingEntry>['pagination']
      season: RankingSeason
    }>(ENDPOINTS.GAMIFICATION.RANKINGS, { params })
    return data
  },

  async getMyRanking(): Promise<MyRanking> {
    const { data } = await api.get<MyRanking>(ENDPOINTS.GAMIFICATION.MY_RANKING)
    return data
  },

  async getUserXp(userId: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<XpTransaction>> {
    const { data } = await api.get<PaginatedResponse<XpTransaction>>(
      ENDPOINTS.USERS.XP(userId),
      { params }
    )
    return data
  },

  async getAchievements(): Promise<Achievement[]> {
    const { data } = await api.get<{ achievements: Achievement[] }>(
      ENDPOINTS.GAMIFICATION.ACHIEVEMENTS
    )
    return data.achievements
  },

  async getMyAchievements(): Promise<UserAchievement[]> {
    const { data } = await api.get<{ achievements: UserAchievement[] }>(
      ENDPOINTS.GAMIFICATION.MY_ACHIEVEMENTS
    )
    return data.achievements
  },
}
