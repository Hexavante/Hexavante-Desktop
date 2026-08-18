import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'

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
      <div className="flex min-h-screen items-center justify-center bg-[#06080f] px-4">
        <div className="hx-card w-full max-w-md p-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-white">Link Inválido</h1>
          <p className="mb-4 text-sm text-slate-400">O link de redefinição é inválido ou expirou.</p>
          <Link to="/forgot-password" className="hx-btn hx-btn-primary inline-block">
            Solicitar Novo Link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06080f] px-4">
      <div className="hx-card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 shadow-lg shadow-cyan-500/20">
            <span className="text-2xl font-black text-cyan-400">H</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">NOVA SENHA</h1>
          <p className="mt-1 text-sm text-slate-400">Digite sua nova senha</p>
        </div>

        {done ? (
          <div className="text-center">
            <p className="mb-4 text-sm text-slate-300">Sua senha foi redefinida com sucesso.</p>
            <button className="hx-btn hx-btn-primary w-full" onClick={() => navigate('/login')}>
              Fazer Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="hx-label">Nova senha</label>
              <input
                type="password"
                className="hx-input"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="hx-label">Confirmar senha</label>
              <input
                type="password"
                className="hx-input"
                placeholder="••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="hx-btn hx-btn-primary w-full" disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
