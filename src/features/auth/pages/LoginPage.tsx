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
import { OAuthButtons, type OAuthProvider } from '@/features/auth/components/oauth-buttons'

const VERIFICATION_CODE_REGEX = /^\d{6}$/

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

  function handleOAuth(provider: OAuthProvider) {
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
          <OAuthButtons
            disabled={oauth.isPending}
            pendingProvider={oauth.variables ?? null}
            onSelect={handleOAuth}
          />

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
                      aria-describedby={codeError ? 'code-error' : undefined}
                      autoFocus
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>
                  {codeError && (
                    <p id="code-error" role="alert" className="mt-1 text-xs text-red-300">{codeError}</p>
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
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1 text-xs text-red-300">{errors.email.message}</p>
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
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className="mt-1 text-xs text-red-300">{errors.password.message}</p>
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