import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/app/stores/auth.store'

export function useSession() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authService.getSession(),
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}
