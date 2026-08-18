import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { registerSchema, type RegisterFormData } from '@/domain/schemas/auth.schema'
import { useRegister, useOAuth } from '@/api/auth/mutations'

export default function RegisterPage() {
  const registerMutation = useRegister()
  const oauth = useOAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    registerMutation.mutate(data, {
      onError: (error) => {
        const err = error as { fields?: Record<string, string> }
        if (err.fields) {
          for (const [field, message] of Object.entries(err.fields)) {
            setError(field as keyof RegisterFormData, { message })
          }
        }
      },
    })
  }

  function handleOAuth(provider: string) {
    oauth.mutate(provider)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(20,184,166,0.08),transparent_40%)]" />
      </div>
      <div className="hx-card relative w-full max-w-md border-white/10 bg-black/40 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 shadow-lg shadow-cyan-500/20">
            <span className="text-2xl font-black text-cyan-400">H</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">CRIAR CONTA</h1>
          <p className="mt-1 text-sm text-slate-400">Preencha os dados para se cadastrar</p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={oauth.isPending}
            className="hx-btn w-full gap-2 border border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {oauth.isPending ? 'Abrindo...' : 'Continuar com Google'}
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('github')}
            disabled={oauth.isPending}
            className="hx-btn w-full gap-2 border border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            {oauth.isPending ? 'Abrindo...' : 'Continuar com GitHub'}
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-500">ou</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="hx-label">Nome de usuário</label>
            <input
              id="username"
              className="hx-input"
              placeholder="joaosilva"
              {...register('username')}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fullName" className="hx-label">Nome completo</label>
            <input
              id="fullName"
              className="hx-input"
              placeholder="João Silva"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="hx-label">Email</label>
            <input
              id="email"
              className="hx-input"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="birthDate" className="hx-label">Data de nascimento</label>
            <input
              id="birthDate"
              className="hx-input"
              type="date"
              {...register('birthDate')}
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-400">{errors.birthDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="hx-label">Senha</label>
            <input
              id="password"
              className="hx-input"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="hx-label">Confirmar senha</label>
            <input
              id="confirmPassword"
              className="hx-input"
              type="password"
              placeholder="••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="hx-btn hx-btn-primary w-full"
            disabled={isSubmitting || registerMutation.isPending}
          >
            {isSubmitting || registerMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Já tem conta?{' '}
          <Link to="/login" className="hx-link">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
