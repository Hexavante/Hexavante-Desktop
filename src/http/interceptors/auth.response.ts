import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/app/stores/auth.store'
import { authIpc } from '@/adapters/ipc/auth.ipc-adapter'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

const SESSION_COOKIE_NAME = 'hexavante.session_token'

function extractSessionTokenFromSetCookie(setCookie: string[]): string | null {
  for (const cookie of setCookie) {
    const match = cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`))
    if (match) return match[1]
  }

  return null
}

export async function authResponseInterceptor(response: AxiosResponse) {
  const setCookie = response.headers['set-cookie']

  if (setCookie) {
    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
    const newToken = extractSessionTokenFromSetCookie(cookies)

    if (newToken && newToken !== useAuthStore.getState().sessionToken) {
      const decoded = decodeURIComponent(newToken)
      useAuthStore.getState().setSessionToken(decoded)
      await authIpc.saveRefreshToken(decoded)
    }
  }

  return response
}
