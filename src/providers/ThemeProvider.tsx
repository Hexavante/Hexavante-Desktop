import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import DOMPurify from 'isomorphic-dompurify'
import { useThemeStore } from '@/app/stores/theme.store'
import { APP_THEMES, THEME_FX, themeFxClasses } from '@/lib/cosmetics'

const ALL_THEME_CLASSES = Object.values(APP_THEMES).map(t => t.className)
const ALL_FX_CLASSES = [...new Set(Object.values(THEME_FX).flat())]

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

  // Flash de transição ao trocar de tema cosmético: overlay opaco com a cor
  // de fundo que desvanece (animate-fade-out já existe no tailwind config).
  const [showFlash, setShowFlash] = useState(false)
  const previousCosmeticTheme = useRef(cosmeticTheme)

  useEffect(() => {
    if (previousCosmeticTheme.current === cosmeticTheme) return
    previousCosmeticTheme.current = cosmeticTheme
    setShowFlash(true)
    const timer = setTimeout(() => setShowFlash(false), 450)
    return () => clearTimeout(timer)
  }, [cosmeticTheme])

  useEffect(() => {
    const root = document.documentElement
    const activeClass = cosmeticTheme !== 'default' && APP_THEMES[cosmeticTheme]
      ? APP_THEMES[cosmeticTheme].className
      : null

    ALL_THEME_CLASSES.forEach(cls => root.classList.remove(cls))
    ALL_FX_CLASSES.forEach(cls => root.classList.remove(cls))
    if (activeClass) root.classList.add(activeClass)
    themeFxClasses(cosmeticTheme).split(' ').filter(Boolean).forEach(cls => root.classList.add(cls))

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
      {themeCss && <style id="hexavante-theme-vars" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(themeCss, { USE_PROFILES: { html: false } }) }} />}
      {showFlash && (
        <div
          aria-hidden="true"
          className="animate-fade-out pointer-events-none fixed inset-0 z-[100]"
          style={{
            background: 'var(--background)',
            animationDuration: '450ms',
            animationFillMode: 'forwards',
          }}
        />
      )}
      {children}
    </>
  )
}
