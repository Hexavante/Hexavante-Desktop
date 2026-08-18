import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'
type CosmeticThemeId = string

interface ThemeState {
  mode: ThemeMode
  resolvedTheme: 'light' | 'dark'
  cosmeticTheme: CosmeticThemeId
  setMode: (mode: ThemeMode) => void
  setResolvedTheme: (theme: 'light' | 'dark') => void
  setCosmeticTheme: (themeId: CosmeticThemeId) => void
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolvedTheme: 'dark',
      cosmeticTheme: 'default',
      setMode: (mode: ThemeMode) => set({ mode }),
      setResolvedTheme: (theme: 'light' | 'dark') =>
        set({ resolvedTheme: theme }),
      setCosmeticTheme: (themeId: CosmeticThemeId) =>
        set({ cosmeticTheme: themeId }),
      toggle: () => {
        const current = get().resolvedTheme
        set({ mode: current === 'dark' ? 'light' : 'dark' })
      }
    }),
    {
      name: 'hexavante-theme',
      partialize: state => ({ mode: state.mode, cosmeticTheme: state.cosmeticTheme })
    }
  )
)
