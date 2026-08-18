import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
      toast.success('Email de recuperação enviado!')
    } catch {
      toast.error('Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06080f] px-4">
      <div className="hx-card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 shadow-lg shadow-cyan-500/20">
            <span className="text-2xl font-black text-cyan-400">H</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">RECUPERAR SENHA</h1>
          <p className="mt-1 text-sm text-slate-400">
            {sent ? 'Verifique seu email para o link de recuperação' : 'Digite seu email para receber o link'}
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="mb-4 text-sm text-slate-300">
              Enviamos um email com instruções para recuperar sua senha.
            </p>
            <Link to="/login" className="hx-btn hx-btn-primary inline-block">
              Voltar ao Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="hx-label">Email</label>
              <input
                type="email"
                className="hx-input"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="hx-btn hx-btn-primary w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Link'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Lembrou sua senha?{' '}
          <Link to="/login" className="hx-link">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
