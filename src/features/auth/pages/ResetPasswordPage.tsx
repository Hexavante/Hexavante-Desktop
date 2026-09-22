import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { toast } from 'sonner'
import { HexavanteLogo } from '@/components/brand/hexavante-logo'

const CODE_REGEX = /^\d{6}$/
const NEUTRAL_MESSAGE = 'Se o e-mail existir, enviamos o código.'

function AuthShell({ children }: { children: React.ReactNode }) {
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
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const stateEmail = (location.state as { email?: string } | null)?.email ?? ''
  const initialEmail = searchParams.get('email') ?? stateEmail

  const [email, setEmail] = useState(initialEmail)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [neutralMessage, setNeutralMessage] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function requestCode(targetEmail: string) {
    setLoading(true)
    try {
      const id = await authService.forgotPassword(targetEmail.trim())
      if (id) {
        setVerificationId(id)
        setNeutralMessage(null)
        toast.success('Código enviado! Confira seu e-mail.')
      } else {
        // Anti-enumeração: mensagem neutra, sem avançar de passo.
        setNeutralMessage(NEUTRAL_MESSAGE)
      }
    } catch (err: unknown) {
      const appError = normalizeError(err)
      toast.error(appError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Informe seu e-mail.')
      return
    }
    await requestCode(email)
  }

  async function handleResend() {
    await requestCode(email)
  }

  function handleUseAnotherEmail() {
    setVerificationId(null)
    setCode('')
    setPassword('')
    setConfirm('')
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!verificationId) return
    if (!CODE_REGEX.test(code.trim())) {
      toast.error('Informe o código de 6 dígitos enviado ao seu e-mail.')
      return
    }
    if (password.length < 8) {
      toast.error('Mínimo de 8 caracteres')
      return
    }
    if (password !== confirm) {
      toast.error('Senhas não conferem')
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(verificationId, code.trim(), password)
      setDone(true)
      toast.success('Senha redefinida com sucesso!')
    } catch (err: unknown) {
      const appError = normalizeError(err)
      toast.error(appError.message || 'Erro ao redefinir senha. O código pode ter expirado.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthShell>
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
      </AuthShell>
    )
  }

  if (!verificationId) {
    return (
      <AuthShell>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Hexavante</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Recuperar senha</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Informe o e-mail da sua conta. Enviaremos um código de 6 dígitos para redefinir a senha.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
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
          {neutralMessage && (
            <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-slate-300">
              {neutralMessage}
            </p>
          )}
          <button type="submit" className="hx-btn hx-btn-primary h-11 w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              'Enviar código'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/login" className="hx-link">
            ← Voltar ao login
          </Link>
        </p>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Hexavante</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Nova senha</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Enviamos um código de 6 dígitos para <span className="text-slate-200">{email}</span>. Informe o código e escolha a nova senha.
        </p>
      </div>

      <form onSubmit={handleResetSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="hx-label">Código de verificação</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            className="hx-input h-11 tracking-[0.3em]"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
          />
        </div>
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
        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="hx-btn-secondary h-11 w-full"
        >
          Reenviar código
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        <button type="button" onClick={handleUseAnotherEmail} className="hx-link">
          Usar outro e-mail
        </button>
      </p>
    </AuthShell>
  )
}
