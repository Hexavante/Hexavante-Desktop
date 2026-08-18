import { ipcMain, app } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'

export function registerSystemIpc(): void {
  ipcMain.handle(IPC_CHANNELS.SYSTEM_INFO, async () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.getSystemVersion(),
      electronVersion: process.versions.electron
    }
  })
}
