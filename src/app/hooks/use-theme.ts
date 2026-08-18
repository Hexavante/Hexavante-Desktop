import { useThemeStore } from '@/app/stores/theme.store'

export function useTheme() {
  const { mode, resolvedTheme, cosmeticTheme, setMode, setCosmeticTheme, toggle } = useThemeStore()

  return {
    mode,
    resolvedTheme,
    cosmeticTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    setMode,
    setTheme: setMode,
    setCosmeticTheme,
    toggle,
  }
}
