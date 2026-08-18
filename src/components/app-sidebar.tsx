import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/hooks/use-auth'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  BookOpen,
  FileCheck,
  BarChart3,
  Trophy,
  MessageCircle,
  Store,
  Backpack,
  User,
  Settings,
  Shield,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { useEffect } from 'react'

const NAV_SECTIONS = [
  {
    id: 'home',
    label: 'Início',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    ],
  },
  {
    id: 'learning',
    label: 'Aprendizado',
    items: [
      { icon: BookOpen, label: 'Cursos', href: '/cursos' },
      { icon: FileCheck, label: 'Simulados', href: '/simulados' },
      { icon: BarChart3, label: 'Estatísticas', href: '/estatisticas' },
    ],
  },
  {
    id: 'social',
    label: 'Comunidade',
    items: [
      { icon: Trophy, label: 'Ranking', href: '/ranking' },
      { icon: MessageCircle, label: 'Comunidade', href: '/comunidade' },
    ],
  },
  {
    id: 'store',
    label: 'Loja',
    items: [
      { icon: Store, label: 'Loja', href: '/loja' },
      { icon: Backpack, label: 'Inventário', href: '/inventario' },
    ],
  },
  {
    id: 'system',
    label: 'Sistema',
    items: [
      { icon: User, label: 'Perfil', href: '/perfil' },
      { icon: Settings, label: 'Configurações', href: '/configuracoes' },
      { icon: Shield, label: 'Administração', href: '/admin' },
    ],
  },
]

function SidebarBrand() {
  return (
    <Link
      to="/"
      className="hx-sidebar-brand group"
      aria-label="Hexavante - Página inicial"
    >
      <span className="hx-sidebar-brand-mark">
        <span className="text-lg font-black text-cyan-400">H</span>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold tracking-tight text-white transition group-hover:text-cyan-100">
          HEXAVANTE
        </span>
        <span className="hx-sidebar-brand-subtitle block truncate text-[11px] font-medium">
          Plataforma de estudos
        </span>
      </span>
    </Link>
  )
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = useLocation().pathname
  const { setOpenMobile } = useSidebar()
  const { user } = useAuth()

  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="hx-sidebar-shell"
    >
      <SidebarHeader className="hx-sidebar-header border-b border-sidebar-border px-3 py-3">
        <SidebarBrand />
      </SidebarHeader>

      <SidebarContent className="hx-sidebar-content gap-1 py-2">
        {NAV_SECTIONS.map(section => (
          <SidebarGroup key={section.id} className="px-2 py-1">
            <SidebarGroupLabel className="hx-sidebar-group-label">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {section.items.map(item => {
                  const active = isActive(pathname, item.href)
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn(
                          'hx-sidebar-link',
                          active && 'hx-sidebar-link-active'
                        )}
                      >
                        <Link to={item.href} title={item.label}>
                          <span
                            className={cn(
                              'hx-sidebar-link-icon',
                              active && 'hx-sidebar-link-icon-active'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="hx-sidebar-footer mt-auto shrink-0 border-t border-sidebar-border px-3 py-3">
        {user ? (
          <div className="space-y-2">
            <Link to="/perfil" className="hx-sidebar-profile">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-slate-300">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">
                  {user.name}
                </span>
                <span className="block truncate text-xs text-slate-400">
                  Ver perfil
                </span>
              </span>
            </Link>
            <Link to="/configuracoes" className="hx-sidebar-settings">
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              className="hx-btn hx-btn-ghost w-full justify-start gap-2 text-sm"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>
            <Link
              to="/register"
              className="hx-btn hx-btn-primary w-full justify-start gap-2 text-sm"
            >
              <UserPlus className="h-4 w-4" />
              Criar conta
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
