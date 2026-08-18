import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/app/hooks/use-theme'
import { useAuth } from '@/app/hooks/use-auth'
import { useLogout } from '@/api/auth/mutations'
import { PageHeader } from '@/components/shared/PageHeader'
import { ThemeSelector } from '@/components/cosmetics/ThemeSelector'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor } from 'lucide-react'

export default function ConfiguracoesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { mode, resolvedTheme, setTheme } = useTheme()
  const logoutMutation = useLogout()

  return (
    <div className="hx-page">
      <PageHeader title="Configurações" description="Personalize sua experiência" />

      <div className="space-y-6">
        <div className="hx-card p-5">
          <h3 className="mb-4 text-sm font-bold text-white">Aparência</h3>
          <div className="flex gap-3">
            <button
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${resolvedTheme === 'dark' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'}`}
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-6 w-6" />
              <span className="text-sm font-medium text-white">Escuro</span>
            </button>
            <button
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${resolvedTheme === 'light' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'}`}
              onClick={() => setTheme('light')}
            >
              <Sun className="h-6 w-6" />
              <span className="text-sm font-medium text-white">Claro</span>
            </button>
            <button
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${mode === 'system' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'}`}
              onClick={() => setTheme('system')}
            >
              <Monitor className="h-6 w-6" />
              <span className="text-sm font-medium text-white">Sistema</span>
            </button>
          </div>
        </div>

        <div className="hx-card p-5">
          <h3 className="mb-4 text-sm font-bold text-white">Temas Decorativos</h3>
          <p className="mb-4 text-xs text-slate-400">
            Escolha um tema visual para personalizar sua experiência.
          </p>
          <ThemeSelector />
        </div>

        <div className="hx-card p-5">
          <h3 className="mb-4 text-sm font-bold text-white">Conta</h3>
          <div className="space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/perfil')}>
                    Editar Perfil
                  </Button>
                </div>
                <hr className="border-white/5" />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-400 hover:text-red-300"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? 'Saindo...' : 'Sair da Conta'}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => navigate('/login')}>Entrar</Button>
                <Button variant="outline" onClick={() => navigate('/register')}>Criar Conta</Button>
              </div>
            )}
          </div>
        </div>

        <div className="hx-card p-5">
          <h3 className="mb-4 text-sm font-bold text-white">Sobre</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Aplicativo</span>
              <span className="text-white">Hexavante Desktop</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Versão</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Plataforma</span>
              <span className="text-white">Electron</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
