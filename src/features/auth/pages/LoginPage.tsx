import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
import { PasswordInput } from '@/components/ui/password-input'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { loginSchema, type LoginFormData } from '@/domain/schemas/auth.schema'
import { useLogin, useOAuth } from '@/api/auth/mutations'
import { authService, VerificationNeededError } from '@/services/auth.service'
import { useAuthStore } from '@/app/stores/auth.store'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { HexavanteLogo } from '@/components/brand/hexavante-logo'

const VERIFICATION_CODE_REGEX = /^\d{6}$/

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export default function LoginPage() {
  const login = useLogin()
  const oauth = useOAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setSessionToken, setUser } = useAuthStore()

  const [verification, setVerification] = useState<{ verificationId: string; reason?: string } | null>(null)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      await login.mutateAsync(data)
    } catch (err: unknown) {
      if (err instanceof VerificationNeededError) {
        setVerification({ verificationId: err.verificationId, reason: err.reason })
        setCode('')
        setCodeError(null)
        toast.info('Enviamos um código de 6 dígitos para o seu e-mail.')
        return
      }
      const result = err as { fields?: Record<string, string> }
      if (result?.fields) {
        for (const [field, message] of Object.entries(result.fields)) {
          setError(field as keyof LoginFormData, { message })
        }
      }
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!verification) return
    const trimmed = code.trim()
    if (!VERIFICATION_CODE_REGEX.test(trimmed)) {
      setCodeError('Informe o código de 6 dígitos enviado ao seu e-mail.')
      return
    }
    setCodeError(null)
    setVerifying(true)
    try {
      const response = await authService.verifyDevice(verification.verificationId, trimmed)
      setSessionToken(response.token)
      setUser(response.user)
      queryClient.clear()
      toast.success('Login realizado com sucesso!')
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const appError = normalizeError(err)
      setCodeError(appError.message || 'Código inválido ou expirado. Tente novamente.')
    } finally {
      setVerifying(false)
    }
  }

  async function handleResend() {
    if (!verification) return
    setResending(true)
    try {
      const verificationId = await authService.resendDeviceCode(verification.verificationId)
      setVerification({ verificationId, reason: verification.reason })
      toast.success('Código reenviado! Confira seu e-mail.')
    } catch (err: unknown) {
      const appError = normalizeError(err)
      toast.error(appError.message)
    } finally {
      setResending(false)
    }
  }

  function handleBackToLogin() {
    setVerification(null)
    setCode('')
    setCodeError(null)
  }

  function handleOAuth(provider: string) {
    oauth.mutate(provider)
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
          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={oauth.isPending}
              className="hx-btn-secondary inline-flex min-h-11 w-full items-center justify-center gap-3 px-5 py-2.5 transition-all hover:shadow-md"
            >
              <GoogleIcon />
              Continuar com Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('github')}
              disabled={oauth.isPending}
              className="hx-btn-secondary inline-flex min-h-11 w-full items-center justify-center gap-3 px-5 py-2.5 transition-all hover:shadow-md"
            >
              <GitHubIcon />
              Continuar com GitHub
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium text-slate-500">ou continue com email</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Hexavante</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-white">ENTRAR</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">Acesse sua conta Hexavante</p>
            </div>

            {verification ? (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="rounded-xl border border-sky-400/20 bg-sky-400/10 p-3 text-sm leading-6 text-sky-200">
                  {verification.reason || 'Detectamos um dispositivo novo. Enviamos um código de 6 dígitos para o seu e-mail.'}
                </div>

                <div>
                  <label htmlFor="code" className="hx-label">Código de verificação</label>
                  <div className="relative">
                    <ShieldCheck
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                      aria-hidden="true"
                    />
                    <input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="000000"
                      className="hx-input h-11 pl-10 tracking-[0.3em]"
                      aria-invalid={Boolean(codeError)}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>
                  {codeError && (
                    <p className="mt-1 text-xs text-red-300">{codeError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="hx-btn hx-btn-primary mt-2 h-11 w-full"
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar e entrar'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="hx-btn-secondary h-11 w-full"
                >
                  {resending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Reenviando...
                    </>
                  ) : (
                    'Reenviar código'
                  )}
                </button>

                <p className="text-center text-sm text-slate-400">
                  <button type="button" onClick={handleBackToLogin} className="hx-link">
                    ← Voltar ao login
                  </button>
                </p>
              </form>
            ) : (
              <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="hx-label">E-mail</label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    className="hx-input h-11 pl-10"
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="hx-label">Senha</label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <PasswordInput
                    id="password"
                    className="pl-10"
                    aria-invalid={Boolean(errors.password)}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>
                )}
                <p className="mt-2 text-right text-sm">
                  <Link to="/forgot-password" className="hx-link">
                    Esqueceu a senha?
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                className="hx-btn hx-btn-primary mt-2 h-11 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Não tem conta?{' '}
              <Link to="/register" className="hx-link">
                Cadastre-se
              </Link>
            </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}