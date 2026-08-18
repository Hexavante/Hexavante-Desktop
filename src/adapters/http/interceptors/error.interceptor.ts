import type { AxiosError } from 'axios'
import axios from 'axios'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { AppError } from '@/adapters/error/app-error'
import { useAuthStore } from '@/app/stores/auth.store'
import { authIpc } from '@/adapters/ipc/auth.ipc-adapter'

interface FailedQueueItem {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedQueueItem[] = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export async function errorResponseInterceptor(error: AxiosError) {
  const originalRequest = error.config

  if (!originalRequest) {
    return Promise.reject(normalizeError(error))
  }

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return originalRequest
        })
        .catch(err => Promise.reject(normalizeError(err)))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = await authIpc.getRefreshToken()
      if (!refreshToken) throw new Error('No refresh token')

      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333'
      const response = await axios.post(`${baseURL}/api/auth/refresh`, {
        refresh_token: refreshToken
      })
      const { access_token, refresh_token } = response.data

      useAuthStore.getState().setSessionToken(access_token)
      await authIpc.saveRefreshToken(refresh_token)

      processQueue(null, access_token)
      originalRequest.headers.Authorization = `Bearer ${access_token}`
      return originalRequest
    } catch (refreshError) {
      processQueue(refreshError, null)
      useAuthStore.getState().clear()
      await authIpc.clearRefreshToken()
      return Promise.reject(AppError.unauthorized('Sessão expirada'))
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(normalizeError(error))
}

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}
