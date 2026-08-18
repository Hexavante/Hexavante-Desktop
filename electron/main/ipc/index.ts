import { registerAuthIpc } from './auth.ipc'
import { registerUpdaterIpc } from './updater.ipc'
import { registerStorageIpc } from './storage.ipc'
import { registerWindowIpc } from './window.ipc'
import { registerSystemIpc } from './system.ipc'
import { registerDialogIpc } from './dialog.ipc'
import { registerShellIpc } from './shell.ipc'
import { registerAppIpc } from './app.ipc'
import { registerLogIpc } from './log.ipc'
import { registerNotificationIpc } from './notification.ipc'

export function registerAllIpc(): void {
  registerAuthIpc()
  registerUpdaterIpc()
  registerStorageIpc()
  registerWindowIpc()
  registerSystemIpc()
  registerDialogIpc()
  registerShellIpc()
  registerAppIpc()
  registerLogIpc()
  registerNotificationIpc()
}
