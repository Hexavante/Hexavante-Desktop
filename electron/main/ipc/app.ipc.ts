import { ipcMain, app } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'

export function registerAppIpc(): void {
  ipcMain.handle(IPC_CHANNELS.APP_GET_VERSION, async () => {
    return app.getVersion()
  })
}
