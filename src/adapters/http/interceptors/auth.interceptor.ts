import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/app/stores/auth.store'

export function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = useAuthStore.getState().sessionToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}
