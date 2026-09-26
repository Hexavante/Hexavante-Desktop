import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { tutorialService } from '@/services/tutorial.service'
import { staleTimes } from '@/app/queries/options'
import type { TutorialQueryParams } from '@/domain/types/tutorial.types'

export function useTutorials(params?: TutorialQueryParams) {
  return useQuery({
    queryKey: queryKeys.tutorials.list(params as Record<string, unknown>),
    queryFn: () => tutorialService.list(params),
    staleTime: staleTimes.NORMAL,
  })
}

export function useTutorial(id: string) {
  return useQuery({
    queryKey: queryKeys.tutorials.detail(id),
    queryFn: () => tutorialService.getById(id),
    enabled: !!id,
    staleTime: staleTimes.SLOW,
  })
}
