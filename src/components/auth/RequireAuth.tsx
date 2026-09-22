import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/app/stores/auth.store'

/**
 * Exige sessão válida. Na primeira montagem tenta restaurar o token
 * salvo (electron-store via IPC); sem sessão, redireciona para /login.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [checking, setChecking] = useState(() => !useAuthStore.getState().isAuthenticated)

  useEffect(() => {
    if (useAuthStore.getState().isAuthenticated) {
      setChecking(false)
      return
    }
    let active = true
    authService
      .restoreSession()
      .then((user) => {
        if (active && user) useAuthStore.getState().setUser(user)
      })
      .catch(() => {
        // sem sessão válida — cai no redirect abaixo
      })
      .finally(() => {
        if (active) setChecking(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (checking) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

/**
 * Páginas públicas de auth: quem já tem sessão volta para o dashboard.
 */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}
