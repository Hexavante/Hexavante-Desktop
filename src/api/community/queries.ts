import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { communityService } from '@/services/community.service'
import { staleTimes } from '@/app/queries/options'

export function useFeed(type: string = 'explore') {
  return useQuery({
    queryKey: queryKeys.community.feed(type),
    queryFn: () => communityService.getFeed(type),
    staleTime: staleTimes.FAST,
  })
}

export function useTrendingTags() {
  return useQuery({
    queryKey: queryKeys.community.trendingTags,
    queryFn: () => communityService.getTrendingTags(),
    staleTime: staleTimes.SLOW,
  })
}

export function useSuggestedUsers() {
  return useQuery({
    queryKey: queryKeys.community.suggestedUsers,
    queryFn: () => communityService.getSuggestedUsers(),
    staleTime: staleTimes.SLOW,
  })
}

export function useComments(activityId: string) {
  return useQuery({
    queryKey: queryKeys.community.comments(activityId),
    queryFn: () => communityService.getComments(activityId),
    enabled: !!activityId,
    staleTime: staleTimes.FAST,
  })
}
