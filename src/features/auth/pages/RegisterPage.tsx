import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { PasswordInput } from '@/components/ui/password-input'
import { toast } from 'sonner'
import { registerSchema, type RegisterFormData } from '@/domain/schemas/auth.schema'
import { useRegister, useOAuth } from '@/api/auth/mutations'
import { VerificationNeededError } from '@/services/auth.service'
import { HexavanteLogo } from '@/components/brand/hexavante-logo'
import { OAuthButtons, type OAuthProvider } from '@/features/auth/components/oauth-buttons'

export default function RegisterPage() {
  const registerMutation = useRegister()
  const oauth = useOAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', fullName: '', email: '', password: '', confirmPassword: '', birthDate: '' },
  })

  async function onSubmit(data: RegisterFormData) {
    registerMutation.mutate(data, {
      onError: (error) => {
        // Conta criada, mas o login automático exigiu verificação de
        // dispositivo novo — o usuário conclui entrando pelo login.
        if (error instanceof VerificationNeededError) {
          toast.info('Conta criada! Enviamos um código de 6 dígitos para o seu e-mail.')
          navigate('/login', { replace: true })
          return
        }
        const err = error as { fields?: Record<string, string> }
        if (err.fields) {
          for (const [field, message] of Object.entries(err.fields)) {
            setError(field as keyof RegisterFormData, { message })
          }
        }
      },
    })
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
              <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Criar conta</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">Junte-se à plataforma Hexavante</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="username" className="hx-label">Nome de usuário</label>
                <input
                  id="username"
                  className="hx-input h-11"
                  placeholder="joaosilva"
                  aria-invalid={Boolean(errors.username)}
                  {...register('username')}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-300">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="hx-label">Nome completo</label>
                <input
                  id="fullName"
                  className="hx-input h-11"
                  placeholder="João Silva"
                  aria-invalid={Boolean(errors.fullName)}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-300">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="hx-label">E-mail</label>
                <input
                  id="email"
                  className="hx-input h-11"
                  type="email"
                  placeholder="seu@email.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="birthDate" className="hx-label">Data de nascimento</label>
                <input
                  id="birthDate"
                  className="hx-input h-11"
                  type="date"
                  aria-invalid={Boolean(errors.birthDate)}
                  {...register('birthDate')}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-xs text-red-300">{errors.birthDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="hx-label">Senha</label>
                <PasswordInput
                  id="password"
                  placeholder="Mínimo 8 caracteres"
                  aria-invalid={Boolean(errors.password)}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="hx-label">Confirmar senha</label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-300">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="hx-btn hx-btn-primary mt-2 h-11 w-full"
                disabled={isSubmitting || registerMutation.isPending}
              >
                {isSubmitting || registerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Já tem conta?{' '}
              <Link to="/login" className="hx-link">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}