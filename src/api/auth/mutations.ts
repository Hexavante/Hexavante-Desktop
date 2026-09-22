import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService, VerificationNeededError } from '@/services/auth.service'
import { useAuthStore } from '@/app/stores/auth.store'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'
import type { LoginRequest } from '@/domain/types/auth.types'
import type { RegisterFormData } from '@/domain/schemas/auth.schema'

export function useLogin() {
  const navigate = useNavigate()
  const { setSessionToken, setUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.signIn(data.email, data.password),
    onSuccess: (response) => {
      setSessionToken(response.token)
      setUser(response.user)
      queryClient.clear()
      toast.success('Login realizado com sucesso!')
      navigate('/', { replace: true })
    },
    onError: (error) => {
      // A etapa de verificação de dispositivo é tratada na página de login.
      if (error instanceof VerificationNeededError) return
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useOAuth() {
  const navigate = useNavigate()
  const { setSessionToken, setUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (provider: string) => authService.signInWithOAuth(provider),
    onSuccess: (response) => {
      setSessionToken(response.token)
      setUser(response.user)
      queryClient.clear()
      toast.success('Login realizado com sucesso!')
      navigate('/', { replace: true })
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const { setSessionToken, setUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.signUp({
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate,
      }),
    onSuccess: (response) => {
      setSessionToken(response.token)
      setUser(response.user)
      queryClient.clear()
      toast.success('Conta criada com sucesso!')
      navigate('/', { replace: true })
    },
    onError: (error) => {
      // Registro seguido de login pode exigir verificação de dispositivo;
      // a página de registro trata esse caso sem toast genérico.
      if (error instanceof VerificationNeededError) return
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useLogout() {
  const { clear } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSettled: () => {
      clear()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}
