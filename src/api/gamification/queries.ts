import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { gamificationService } from '@/services/gamification.service'
import { useAuthStore } from '@/app/stores/auth.store'
import { staleTimes } from '@/app/queries/options'

export function useXpProfile() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.gamification.xpProfile,
    queryFn: () => gamificationService.getXpProfile(),
    enabled: isAuthenticated,
    staleTime: staleTimes.NORMAL,
  })
}

export function useRankings(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.gamification.rankings(params as Record<string, unknown>),
    queryFn: () => gamificationService.getRankings(params),
    staleTime: staleTimes.FAST,
  })
}

export function useMyRanking() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.gamification.myRanking,
    queryFn: () => gamificationService.getMyRanking(),
    enabled: isAuthenticated,
    staleTime: staleTimes.FAST,
  })
}

export function useUserXp(userId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.gamification.userXp(userId),
    queryFn: () => gamificationService.getUserXp(userId, params),
    enabled: !!userId,
    staleTime: staleTimes.NORMAL,
  })
}

export function useAchievements() {
  return useQuery({
    queryKey: queryKeys.gamification.achievements,
    queryFn: () => gamificationService.getAchievements(),
    staleTime: staleTimes.LAZY,
  })
}

export function useMyAchievements() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.gamification.myAchievements,
    queryFn: () => gamificationService.getMyAchievements(),
    enabled: isAuthenticated,
    staleTime: staleTimes.NORMAL,
  })
}
