import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { userService } from '@/services/user.service'
import { useAuthStore } from '@/app/stores/auth.store'
import { staleTimes } from '@/app/queries/options'

export function useProfile() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.users.profile,
    queryFn: () => userService.getProfile(),
    enabled: isAuthenticated,
    staleTime: staleTimes.NORMAL,
  })
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.users.publicProfile(username),
    queryFn: () => userService.getPublicProfile(username),
    enabled: !!username,
    staleTime: staleTimes.NORMAL,
  })
}
