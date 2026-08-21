import { session, app } from 'electron'

export function setupSecurity(): void {
  const defaultSession = session.defaultSession

  if (app.isPackaged) {
    defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.hexavante.com.br https://*.supabase.co http://localhost:3045 http://127.0.0.1:3045; img-src 'self' data: https://*.googleusercontent.com https://avatars.githubusercontent.com; form-action 'self';"
          ]
        }
      })
    })
  }

  defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowedPermissions = ['notifications', 'clipboard-read']
    callback(allowedPermissions.includes(permission))
  })
}
