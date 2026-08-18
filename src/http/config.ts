function getBaseURL(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:3045'
  }
  return 'http://localhost:3045'
}

export const httpConfig = {
  baseURL: getBaseURL(),
  timeout: 30000,
  version: '1.0.0',
} as const
