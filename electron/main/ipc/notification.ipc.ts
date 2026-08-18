import { ipcMain, Notification } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'

export function registerNotificationIpc(): void {
  ipcMain.handle(IPC_CHANNELS.NOTIFICATION_SHOW, (_event, title: string, body: string) => {
    const notification = new Notification({ title, body })
    notification.show()
  })
}
