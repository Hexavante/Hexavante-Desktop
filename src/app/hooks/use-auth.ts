import { useAuthStore } from '@/app/stores/auth.store'
import { useSession } from '@/api/auth/queries'
import { useLogout } from '@/api/auth/mutations'

export function useAuth() {
  const { user, sessionToken, isAuthenticated, clear } = useAuthStore()
  const { data: sessionUser, isLoading } = useSession()
  const logoutMutation = useLogout()

  return {
    user: sessionUser ?? user,
    sessionToken,
    isAuthenticated: !!isAuthenticated,
    isLoading,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  }
}
