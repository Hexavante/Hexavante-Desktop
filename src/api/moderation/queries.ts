import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { moderationService } from '@/services/moderation.service'
import { staleTimes } from '@/app/queries/options'

export function useModerationStats() {
  return useQuery({
    queryKey: queryKeys.moderation.stats,
    queryFn: () => moderationService.getStats(),
    staleTime: staleTimes.FAST,
  })
}

export function useModerationUsers(params?: {
  search?: string
  status?: string
  role?: string
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.moderation.users(params),
    queryFn: () => moderationService.listUsers(params),
    staleTime: staleTimes.INSTANT,
  })
}