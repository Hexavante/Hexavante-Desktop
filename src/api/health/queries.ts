import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { healthService } from '@/services/health.service'
import { staleTimes } from '@/app/queries/options'

export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health.check,
    queryFn: () => healthService.check(),
    staleTime: staleTimes.FAST,
    retry: 1,
  })
}
