import { useAuth } from '@/app/hooks/use-auth'
import { useTheme } from '@/app/hooks/use-theme'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { GamificationHud } from '@/components/gamification/GamificationHud'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Settings, User, Sun, Moon, Search } from 'lucide-react'
import { HexavanteLogo } from '@/components/brand/hexavante-logo'

export function Header() {
  const { user, logout, isLoggingOut } = useAuth()
  const { toggle, resolvedTheme } = useTheme()
  const navigate = useNavigate()

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'))
  }

  return (
    <header className="hx-header-bar sticky top-0 z-20">
      <div className="flex w-full items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <SidebarTrigger />

        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="hx-header-brand group shrink-0"
            aria-label="Hexavante - Página inicial"
          >
            <HexavanteLogo
              showWordmark
              size="lg"
              className="gap-2 sm:gap-2.5"
              imageClassName="hx-header-logo-glow h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12"
              wordmarkClassName="hx-header-wordmark hidden md:inline md:text-xl lg:text-[1.35rem]"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={openCommandPalette}
              className="navbar-search w-full text-left"
              aria-label="Abrir busca (Ctrl+K)"
            >
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="pointer-events-none flex-1 text-sm text-slate-500">
                Buscar cursos, simulados...
              </span>
              <kbd className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>

        <nav className="flex shrink-0 items-center gap-1.5 text-sm sm:gap-2">
          {user && <GamificationHud />}

          <Button variant="ghost" size="icon" onClick={toggle}>
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/notificacoes')}
                aria-label="Notificações"
              >
                <Bell className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-slate-300 transition hover:ring-2 hover:ring-cyan-400/30"
                    aria-label={`Perfil de ${user.name}`}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    <User className="mr-2 h-4 w-4" />
                    Meu perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-400"
                    onClick={logout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hx-btn hx-btn-ghost text-xs sm:text-sm">
                Entrar
              </Link>
              <Link to="/register" className="hx-btn hx-btn-primary text-xs sm:text-sm">
                Criar conta
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
