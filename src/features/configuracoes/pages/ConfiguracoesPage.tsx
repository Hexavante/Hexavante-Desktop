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
          <h3 className="mb-4 text-sm font-bold text-foreground">Aparência</h3>
          <div className="flex gap-3">
            <button
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${resolvedTheme === 'dark' ? 'border-cyan-500 bg-cyan-500/10' : 'border-border hover:border-muted-foreground/30'}`}
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-6 w-6" />
              <span className="text-sm font-medium text-foreground">Escuro</span>
            </button>
            <button
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${resolvedTheme === 'light' ? 'border-cyan-500 bg-cyan-500/10' : 'border-border hover:border-muted-foreground/30'}`}
              onClick={() => setTheme('light')}
            >
              <Sun className="h-6 w-6" />
              <span className="text-sm font-medium text-foreground">Claro</span>
            </button>
            <button
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${mode === 'system' ? 'border-cyan-500 bg-cyan-500/10' : 'border-border hover:border-muted-foreground/30'}`}
              onClick={() => setTheme('system')}
            >
              <Monitor className="h-6 w-6" />
              <span className="text-sm font-medium text-foreground">Sistema</span>
            </button>
          </div>
        </div>

        <div className="hx-card p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">Temas Decorativos</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Escolha um tema visual para personalizar sua experiência.
          </p>
          <ThemeSelector />
        </div>

        <div className="hx-card p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">Conta</h3>
          <div className="space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/perfil')}>
                    Editar Perfil
                  </Button>
                </div>
                <hr className="border-border" />
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
          <h3 className="mb-4 text-sm font-bold text-foreground">Sobre</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aplicativo</span>
              <span className="text-foreground">Hexavante Desktop</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versão</span>
              <span className="text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plataforma</span>
              <span className="text-foreground">Electron</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
