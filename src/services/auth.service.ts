import { api } from '@/http/client'
import { httpConfig, SESSION_COOKIE_NAME } from '@/http/config'
import { ENDPOINTS } from '@/http/endpoints'
import { authIpc } from '@/adapters/ipc/auth.ipc-adapter'
import { useAuthStore } from '@/app/stores/auth.store'
import type { AuthUser, SessionResponse } from '@/domain/types/auth.types'

function extractTokenFromSetCookie(setCookie: string | string[] | undefined): string | null {
  if (!setCookie) return null
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
  for (const cookie of cookies) {
    const match = cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`))
    if (match) return decodeURIComponent(match[1])
  }
  return null
}

export const authService = {
  async signIn(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const response = await api.post<{ token: string; user: AuthUser }>(
      ENDPOINTS.BETTER_AUTH.SIGN_IN_EMAIL,
      { email, password }
    )

    const signedToken = extractTokenFromSetCookie(response.headers['set-cookie']) || response.data.token

    useAuthStore.getState().setSessionToken(signedToken)
    await authIpc.saveRefreshToken(signedToken)

    return { token: signedToken, user: response.data.user }
  },

  async signUp(body: {
    username: string
    fullName: string
    email: string
    password: string
    birthDate: string
  }): Promise<{ token: string; user: AuthUser }> {
    const response = await api.post<{ token: string; user: AuthUser }>(
      ENDPOINTS.BETTER_AUTH.SIGN_UP_EMAIL,
      {
        name: body.fullName,
        email: body.email,
        password: body.password,
        username: body.username,
        birthDate: body.birthDate,
      }
    )

    const signedToken = extractTokenFromSetCookie(response.headers['set-cookie']) || response.data.token

    useAuthStore.getState().setSessionToken(signedToken)
    await authIpc.saveRefreshToken(signedToken)

    return { token: signedToken, user: response.data.user }
  },

  async signInWithOAuth(provider: string): Promise<{ token: string; user: AuthUser }> {
    const token = await authIpc.oauth(provider, httpConfig.baseURL)

    if (!token || token === 'undefined') {
      throw new Error('Falha na autenticação com ' + provider)
    }

    useAuthStore.getState().setSessionToken(token)

    const { data } = await api.get<SessionResponse>(ENDPOINTS.AUTH.SESSION)

    if (!data.user) {
      throw new Error('Sessão não encontrada após OAuth')
    }

    await authIpc.saveRefreshToken(token)

    return { token, user: data.user }
  },

  async getSession(): Promise<SessionResponse['user'] | null> {
    const { data } = await api.get<SessionResponse>(ENDPOINTS.AUTH.SESSION)
    return data.user
  },

  async signOut(): Promise<void> {
    try {
      await api.post(ENDPOINTS.BETTER_AUTH.SIGN_OUT)
    } finally {
      await authIpc.clearRefreshToken()
    }
  },

  async restoreSession(): Promise<AuthUser | null> {
    const token = await authIpc.getRefreshToken()

    if (!token) return null

    useAuthStore.getState().setSessionToken(token)

    const user = await this.getSession()
    return user ?? null
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post(ENDPOINTS.BETTER_AUTH.FORGET_PASSWORD, { email })
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post(ENDPOINTS.BETTER_AUTH.RESET_PASSWORD, { token, newPassword })
  },
}
