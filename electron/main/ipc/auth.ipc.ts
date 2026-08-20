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
    const sessionCookieNames = [
      'hexavante.session_token',
      '__Secure-hexavante.session_token',
    ]

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
    const session = authWindow.webContents.session

    let resolved = false
    let resolve: (value: string | PromiseLike<string>) => void = () => {}
    let reject: (reason: unknown) => void = () => {}

    const finish = (cookieValue: string) => {
      if (resolved) return
      resolved = true
      clearInterval(pollInterval)
      session.cookies.removeListener('changed', onCookieChanged)
      authWindow.close()
      resolve(cookieValue)
    }

    const checkCookies = () => {
      if (resolved) return
      session.cookies
        .get({ url: baseUrl })
        .then((cookies) => {
          if (resolved) return
          const sessionCookie = cookies.find(
            (c) => sessionCookieNames.includes(c.name) && c.value
          )
          if (sessionCookie?.value) finish(sessionCookie.value)
        })
        .catch(() => {})
    }

    // Detecta o cookie de sessão assim que a API o definir no callback do OAuth,
    // antes mesmo da pagina de sucesso fechar a janela (corrige corrida de tempo).
    const onCookieChanged = (_event: Electron.Event, cookie: Electron.Cookie) => {
      if (resolved) return
      if (sessionCookieNames.includes(cookie.name) && cookie.value) {
        finish(cookie.value)
      }
    }

    session.cookies.on('changed', onCookieChanged)

    const onNavigate = () => {
      if (resolved) return
      setTimeout(checkCookies, 300)
      setTimeout(checkCookies, 800)
    }

    authWindow.webContents.on('will-redirect', onNavigate)
    authWindow.webContents.on('did-navigate', onNavigate)
    authWindow.webContents.on('did-finish-load', checkCookies)

    const pollInterval = setInterval(checkCookies, 500)

    authWindow.on('closed', () => {
      clearInterval(pollInterval)
      session.cookies.removeListener('changed', onCookieChanged)
      if (!resolved) {
        reject(new Error('Janela de autenticação fechada'))
      }
    })

    return new Promise<string>((res, rej) => {
      resolve = res
      reject = rej
      authWindow.loadURL(oauthUrl).then(checkCookies).catch(rej)
    })
  })
}
