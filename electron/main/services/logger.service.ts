import log from 'electron-log/main'
import { app } from 'electron'

export function setupLogger(): void {
  log.initialize()

  log.transports.file.level = app.isPackaged ? 'info' : 'debug'
  log.transports.file.maxSize = 10 * 1024 * 1024
  log.transports.file.fileName = 'hexavante.log'

  log.transports.console.level = app.isPackaged ? false : 'debug'
}

export function getLogger() {
  return log
}
