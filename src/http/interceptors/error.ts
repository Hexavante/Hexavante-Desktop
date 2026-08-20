import type { AxiosError } from 'axios'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { AppError } from '@/adapters/error/app-error'
import { useAuthStore } from '@/app/stores/auth.store'
import { authIpc } from '@/adapters/ipc/auth.ipc-adapter'
import { SESSION_COOKIE_NAME } from '@/http/config'

export async function errorResponseInterceptor(error: AxiosError) {
  const originalRequest = error.config

  if (!originalRequest) {
    return Promise.reject(normalizeError(error))
  }

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    const currentToken = useAuthStore.getState().sessionToken

    if (!currentToken) {
      return Promise.reject(AppError.unauthorized('Sessão expirada'))
    }

    try {
      const { api } = await import('@/http/client')
      const sessionResponse = await api.get('/api/v1/auth/session')

      if (sessionResponse.status === 200) {
        originalRequest.headers.Cookie = `${SESSION_COOKIE_NAME}=${currentToken}`
        return api(originalRequest)
      }

      useAuthStore.getState().clear()
      await authIpc.clearRefreshToken()
      return Promise.reject(AppError.unauthorized('Sessão expirada'))
    } catch {
      useAuthStore.getState().clear()
      await authIpc.clearRefreshToken()
      return Promise.reject(AppError.unauthorized('Sessão expirada'))
    }
  }

  return Promise.reject(normalizeError(error))
}
