function getBaseURL(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:3045'
  }
  return 'https://api.hexavante.com.br'
}

export const httpConfig = {
  baseURL: getBaseURL(),
  timeout: 30000,
  version: '1.0.0',
} as const

export const SESSION_COOKIE_NAME = '__Secure-hexavante.session_token'
