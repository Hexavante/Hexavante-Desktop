import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { HexavanteLogo } from '@/components/brand/hexavante-logo'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Senhas não conferem')
      return
    }
    if (password.length < 8) {
      toast.error('Mínimo de 8 caracteres')
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      setDone(true)
      toast.success('Senha redefinida com sucesso!')
    } catch {
      toast.error('Erro ao redefinir senha. O link pode ter expirado.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(20,184,166,0.08),transparent_40%)]" />
        </div>
        <div className="relative z-10 flex w-full max-w-md flex-col items-center">
          <Link
            to="/"
            className="mb-8 flex items-center"
            aria-label="Hexavante - Página inicial"
          >
            <HexavanteLogo size="md" wordmarkClassName="text-white" />
          </Link>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/70 p-8 text-center shadow-lg shadow-black/30 backdrop-blur">
            <p className="text-slate-300">Link inválido. Solicite uma nova recuperação de senha.</p>
            <Link to="/forgot-password" className="hx-btn hx-btn-primary mt-6 inline-block">
              Recuperar senha
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(20,184,166,0.08),transparent_40%)]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Link
          to="/"
          className="mb-8 flex items-center"
          aria-label="Hexavante - Página inicial"
        >
          <HexavanteLogo size="md" wordmarkClassName="text-white" />
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/70 p-8 shadow-lg shadow-black/30 backdrop-blur">
          {done ? (
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-white">Senha redefinida</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sua senha foi redefinida com sucesso. Faça login com a nova senha.
              </p>
              <button
                className="hx-btn hx-btn-primary mt-6 w-full"
                onClick={() => navigate('/login')}
              >
                Ir para o login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Hexavante</p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Nova senha</h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Escolha uma senha segura com no mínimo 8 caracteres.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="hx-label">Nova senha</label>
                  <input
                    id="password"
                    type="password"
                    className="hx-input h-11"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="hx-label">Confirmar senha</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="hx-input h-11"
                    placeholder="••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="hx-btn hx-btn-primary h-11 w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Redefinindo...
                    </>
                  ) : (
                    'Redefinir senha'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}