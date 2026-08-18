import { session, app } from 'electron'

export function setupSecurity(): void {
  const defaultSession = session.defaultSession

  if (app.isPackaged) {
    defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' *; img-src 'self' data:; form-action 'self';"
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
