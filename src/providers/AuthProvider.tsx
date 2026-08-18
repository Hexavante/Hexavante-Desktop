import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useAuthStore } from '@/app/stores/auth.store'
import { authService } from '@/services/auth.service'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, setSessionToken, setUser, clear } = useAuthStore()

  useEffect(() => {
    async function restoreSession() {
      try {
        const user = await authService.restoreSession()
        if (user) {
          setUser(user)
        } else {
          clear()
        }
      } catch {
        clear()
      }
    }

    if (!isAuthenticated) {
      restoreSession()
    }
  }, [isAuthenticated, setSessionToken, setUser, clear])

  return <>{children}</>
}
