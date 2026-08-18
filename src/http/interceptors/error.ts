import type { AxiosError } from 'axios'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { AppError } from '@/adapters/error/app-error'
import { useAuthStore } from '@/app/stores/auth.store'
import { authIpc } from '@/adapters/ipc/auth.ipc-adapter'
import { httpConfig } from '@/http/config'

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
      const response = await fetch(
        `${httpConfig.baseURL}/api/v1/auth/session`,
        {
          headers: {
            Cookie: `hexavante.session_token=${currentToken}`,
          },
        }
      )

      if (response.ok) {
        originalRequest.headers.Cookie = `hexavante.session_token=${currentToken}`
        return originalRequest
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
