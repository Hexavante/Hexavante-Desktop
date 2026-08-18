import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'
import { RefreshTokenSchema } from '../utils/schemas'
import * as secureStore from '../services/secure-store.service'
import { getLogger } from '../services/logger.service'

export function registerAuthIpc(): void {
  ipcMain.handle(IPC_CHANNELS.AUTH_SAVE_REFRESH_TOKEN, async (_event, token: unknown) => {
    const parsed = RefreshTokenSchema.safeParse(token)
    if (!parsed.success) {
      throw new Error('Invalid refresh token')
    }
    await secureStore.saveRefreshToken(parsed.data)
    getLogger().debug('Refresh token saved')
  })

  ipcMain.handle(IPC_CHANNELS.AUTH_GET_REFRESH_TOKEN, async () => {
    const token = await secureStore.getRefreshToken()
    return token
  })

  ipcMain.handle(IPC_CHANNELS.AUTH_CLEAR_REFRESH_TOKEN, async () => {
    await secureStore.clearRefreshToken()
    getLogger().debug('Refresh token cleared')
  })

  ipcMain.handle(IPC_CHANNELS.AUTH_OAUTH, async (_event, provider: string, apiUrl: string) => {
    const baseUrl = 'https://api.hexavante.com.br'
    const successPath = '/api/v1/auth/oauth/success'
    const callbackUrl = `${baseUrl}${successPath}`
    const oauthUrl = `${baseUrl}/oauth/${provider}?callbackURL=${encodeURIComponent(callbackUrl)}`

    const authWindow = new BrowserWindow({
      width: 800,
      height: 700,
      title: `Login com ${provider}`,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    })

    let resolved = false

    function checkCookie() {
      if (resolved) return
      authWindow.webContents.session.cookies
        .get({ url: baseUrl })
        .then((cookies) => {
          if (resolved) return
          const sessionCookie =
            cookies.find((c) => c.name === 'hexavante.session_token') ||
            cookies.find((c) => c.name === '__Secure-hexavante.session_token')
          if (sessionCookie?.value) {
            resolved = true
            authWindow.close()
            resolve(sessionCookie.value)
          }
        })
        .catch(() => {})
    }

    const onNavigate = () => {
      if (resolved) return
      setTimeout(checkCookie, 500)
      setTimeout(checkCookie, 1500)
    }

    authWindow.webContents.on('will-redirect', onNavigate)
    authWindow.webContents.on('did-navigate', onNavigate)
    authWindow.webContents.on('did-finish-load', checkCookie)

    let resolve: (value: string | PromiseLike<string>) => void = () => {}
    let reject: (reason: unknown) => void = () => {}

    const pollInterval = setInterval(checkCookie, 1000)

    authWindow.on('closed', () => {
      clearInterval(pollInterval)
      if (!resolved) {
        reject(new Error('Janela de autenticação fechada'))
      }
    })

    return new Promise<string>((res, rej) => {
      resolve = res
      reject = rej
      authWindow.loadURL(oauthUrl).then(checkCookie).catch(rej)
    })
  })
}
