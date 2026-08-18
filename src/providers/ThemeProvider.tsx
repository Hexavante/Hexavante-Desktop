import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { useThemeStore } from '@/app/stores/theme.store'
import { APP_THEMES } from '@/lib/cosmetics'

const ALL_THEME_CLASSES = Object.values(APP_THEMES).map(t => t.className)

function buildThemeVarsStyle(themeId: string): string | null {
  const theme = APP_THEMES[themeId]
  if (!theme || theme.id === 'default') return null

  const declarations = Object.entries(theme.vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ')

  return `html.${theme.className} {\n  ${declarations}\n}`
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode, resolvedTheme, cosmeticTheme, setResolvedTheme } = useThemeStore()

  const themeCss = useMemo(() => buildThemeVarsStyle(cosmeticTheme), [cosmeticTheme])

  useEffect(() => {
    const root = document.documentElement
    const activeClass = cosmeticTheme !== 'default' && APP_THEMES[cosmeticTheme]
      ? APP_THEMES[cosmeticTheme].className
      : null

    ALL_THEME_CLASSES.forEach(cls => root.classList.remove(cls))
    if (activeClass) root.classList.add(activeClass)

    const effectiveTheme: 'light' | 'dark' = (() => {
      if (mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return mode
    })()

    root.dataset.themeMode = effectiveTheme
    setResolvedTheme(effectiveTheme)

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light'
        setResolvedTheme(newTheme)
        root.dataset.themeMode = newTheme
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [mode, cosmeticTheme, setResolvedTheme])

  return (
    <>
      {themeCss && <style id="hexavante-theme-vars" dangerouslySetInnerHTML={{ __html: themeCss }} />}
      {children}
    </>
  )
}
