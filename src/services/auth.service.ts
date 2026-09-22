import { api } from '@/http/client'
import { httpConfig, SESSION_COOKIE_NAME } from '@/http/config'
import { ENDPOINTS } from '@/http/endpoints'
import { authIpc } from '@/adapters/ipc/auth.ipc-adapter'
import { useAuthStore } from '@/app/stores/auth.store'
import type { AuthUser, SessionResponse } from '@/domain/types/auth.types'

export class VerificationNeededError extends Error {
  verificationId: string
  reason?: string

  constructor(verificationId: string, reason?: string) {
    super('Verificação de dispositivo necessária. Confira seu e-mail.')
    this.name = 'VerificationNeededError'
    this.verificationId = verificationId
    this.reason = reason
  }
}

interface ApiUser {
  id: string
  name: string
  email: string
  username: string
  avatarUrl?: string | null
  roles: string[]
}

interface LoginSuccessResponse {
  user: ApiUser
  session: { token: string; expiresAt: string }
}

interface LoginVerificationResponse {
  requiresVerification: true
  verificationId: string
  reason?: string
}

type LoginResponse = LoginSuccessResponse | LoginVerificationResponse

function isVerificationResponse(data: LoginResponse): data is LoginVerificationResponse {
  return (data as LoginVerificationResponse).requiresVerification === true
}

function mapApiUserToAuthUser(user: ApiUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    roles: user.roles ?? [],
  }
}

function extractTokenFromSetCookie(setCookie: string | string[] | undefined): string | null {
  if (!setCookie) return null
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
  for (const cookie of cookies) {
    const match = cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`))
    if (match) return decodeURIComponent(match[1])
  }
  return null
}

function resolveSessionToken(
  setCookie: string | string[] | undefined,
  fallback: string | undefined,
): string {
  const token = extractTokenFromSetCookie(setCookie) ?? fallback
  if (!token) {
    throw new Error('Sessão não retornada pela API')
  }
  return token
}

async function persistSessionToken(token: string): Promise<void> {
  useAuthStore.getState().setSessionToken(token)
  await authIpc.saveRefreshToken(token)
}

export const authService = {
  async signIn(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const response = await api.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, { email, password })

    if (response.status === 202 || isVerificationResponse(response.data)) {
      const data = response.data as LoginVerificationResponse
      throw new VerificationNeededError(data.verificationId, data.reason)
    }

    const data = response.data as LoginSuccessResponse
    const signedToken = resolveSessionToken(response.headers['set-cookie'], data.session?.token)

    await persistSessionToken(signedToken)

    return { token: signedToken, user: mapApiUserToAuthUser(data.user) }
  },

  async signUp(body: {
    username: string
    fullName: string
    email: string
    password: string
    birthDate: string
  }): Promise<{ token: string; user: AuthUser }> {
    await api.post<{ user: ApiUser }>(ENDPOINTS.AUTH.REGISTER, {
      username: body.username,
      fullName: body.fullName,
      email: body.email,
      password: body.password,
      birthDate: body.birthDate,
    })

    // O registro não cria sessão — autentica em seguida.
    // Pode lançar VerificationNeededError (dispositivo novo).
    return this.signIn(body.email, body.password)
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
    const { data } = await api.get<{ user: ApiUser | null }>(ENDPOINTS.AUTH.SESSION)
    if (!data?.user) return null
    return mapApiUserToAuthUser(data.user)
  },

  async signOut(): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT)
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

  async verifyDevice(
    verificationId: string,
    code: string,
  ): Promise<{ token: string; user: AuthUser }> {
    const response = await api.post<{ user: ApiUser; session: { token: string; expiresAt: string } }>(
      ENDPOINTS.AUTH.VERIFY_DEVICE,
      { verificationId, code },
    )

    const signedToken = resolveSessionToken(response.headers['set-cookie'], response.data.session?.token)

    await persistSessionToken(signedToken)

    return { token: signedToken, user: mapApiUserToAuthUser(response.data.user) }
  },

  async resendDeviceCode(verificationId: string): Promise<string> {
    const { data } = await api.post<{ verificationId: string }>(ENDPOINTS.AUTH.RESEND_CODE, {
      verificationId,
    })
    return data.verificationId
  },

  async forgotPassword(email: string): Promise<string | null> {
    const { data } = await api.post<{ ok: boolean; verificationId: string | null }>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
    )
    return data.verificationId ?? null
  },

  async resetPassword(verificationId: string, code: string, newPassword: string): Promise<void> {
    await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      verificationId,
      code,
      password: newPassword,
    })
  },
}
