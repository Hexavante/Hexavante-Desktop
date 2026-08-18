import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'
import * as updaterService from '../services/updater.service'

export function registerUpdaterIpc(): void {
  ipcMain.handle(IPC_CHANNELS.UPDATER_CHECK, async () => {
    const result = await updaterService.checkForUpdates()
    if (result && result.updateInfo) {
      return {
        version: result.updateInfo.version,
        releaseDate: result.updateInfo.releaseDate,
        releaseNotes: result.updateInfo.releaseNotes
      }
    }
    return null
  })

  ipcMain.handle(IPC_CHANNELS.UPDATER_DOWNLOAD, async () => {
    updaterService.downloadUpdate()
  })

  ipcMain.handle(IPC_CHANNELS.UPDATER_INSTALL, async () => {
    updaterService.installUpdate()
  })
}
