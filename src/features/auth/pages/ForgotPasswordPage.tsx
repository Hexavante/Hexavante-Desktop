import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HexavanteLogo } from '@/components/brand/hexavante-logo'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // O fluxo de recuperação vive em /reset-password (passo 1: e-mail).
    // Passa o e-mail via query param para pré-preencher o campo.
    navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`)
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
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Hexavante</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Recuperar senha</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Informe o e-mail da sua conta. Enviaremos um código para redefinir a senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="hx-label">E-mail</label>
              <input
                id="email"
                type="email"
                className="hx-input h-11"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="hx-btn hx-btn-primary h-11 w-full">
              Continuar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            <Link to="/login" className="hx-link">
              ← Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
