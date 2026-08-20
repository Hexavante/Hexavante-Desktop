import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/app/stores/auth.store'
import { SESSION_COOKIE_NAME } from '@/http/config'

export function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = useAuthStore.getState().sessionToken

  if (token) {
    config.headers.Cookie = `${SESSION_COOKIE_NAME}=${token}`
  }

  return config
}
