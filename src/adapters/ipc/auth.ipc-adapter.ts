function getAuthApi() {
  return window.electronAPI?.auth
}

export const authIpc = {
  saveRefreshToken: async (token: string) => {
    return getAuthApi()?.saveRefreshToken(token)
  },
  getRefreshToken: async () => {
    return getAuthApi()?.getRefreshToken() ?? null
  },
  clearRefreshToken: async () => {
    return getAuthApi()?.clearRefreshToken()
  },
  oauth: async (provider: string, apiUrl: string) => {
    const api = getAuthApi()
    if (!api) throw new Error('Electron API não disponível')
    return api.oauth(provider, apiUrl)
  }
}
