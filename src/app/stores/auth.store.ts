import { create } from 'zustand'
import type { AuthUser } from '@/domain/types/auth.types'

interface AuthState {
  user: AuthUser | null
  sessionToken: string | null
  isAuthenticated: boolean
  setSessionToken: (token: string) => void
  setUser: (user: AuthUser) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionToken: null,
  isAuthenticated: false,
  setSessionToken: (token: string) =>
    set({ sessionToken: token, isAuthenticated: true }),
  setUser: (user: AuthUser) => set({ user }),
  clear: () =>
    set({
      user: null,
      sessionToken: null,
      isAuthenticated: false,
    }),
}))
