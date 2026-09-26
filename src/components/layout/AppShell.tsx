import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/Header'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useServerThemeSync } from '@/app/hooks/use-server-theme-sync'
import type { ReactNode } from 'react'

const BARE_LAYOUT_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password']

interface AppShellProps {
  children: ReactNode
}

function ShellContent({ children, onCtrlK }: { children: ReactNode; onCtrlK: () => void }) {
  useKeyboardShortcuts(onCtrlK)
  return <>{children}</>
}

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation()
  const [paletteOpen, setPaletteOpen] = useState(false)
  useServerThemeSync()
  const useBareLayout = BARE_LAYOUT_PREFIXES.some(prefix => pathname.startsWith(prefix))

  const handleCtrlK = useCallback(() => setPaletteOpen(true), [])

  useEffect(() => {
    const openPalette = () => setPaletteOpen(true)
    window.addEventListener('open-command-palette', openPalette)
    return () => window.removeEventListener('open-command-palette', openPalette)
  }, [])

  if (useBareLayout) {
    return <>{children}</>
  }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="app-shell flex-1">
          <ShellContent onCtrlK={handleCtrlK}>{children}</ShellContent>
        </div>
      </SidebarInset>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </SidebarProvider>
  )
}
