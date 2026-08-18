import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'
import { getLogger } from './logger.service'

export function setupUpdater(mainWindow: BrowserWindow): void {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    getLogger().info('Checking for updates...')
  })

  autoUpdater.on('update-available', info => {
    getLogger().info('Update available:', info.version)
    mainWindow.webContents.send(IPC_CHANNELS.UPDATER_ON_AVAILABLE, {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes
    })
  })

  autoUpdater.on('update-not-available', () => {
    getLogger().info('No updates available')
  })

  autoUpdater.on('download-progress', progressObj => {
    mainWindow.webContents.send(IPC_CHANNELS.UPDATER_ON_PROGRESS, {
      percent: progressObj.percent,
      bytesPerSecond: progressObj.bytesPerSecond,
      total: progressObj.total,
      transferred: progressObj.transferred
    })
  })

  autoUpdater.on('update-downloaded', () => {
    getLogger().info('Update downloaded')
    mainWindow.webContents.send(IPC_CHANNELS.UPDATER_ON_DOWNLOADED)
  })

  autoUpdater.on('error', err => {
    getLogger().error('Updater error:', err.message)
  })

  autoUpdater.checkForUpdates().catch(err => {
    getLogger().debug('Initial update check failed:', err.message)
  })
}

export async function checkForUpdates(): Promise<ReturnType<typeof autoUpdater.checkForUpdates>> {
  return autoUpdater.checkForUpdates()
}

export function downloadUpdate(): void {
  autoUpdater.downloadUpdate()
}

export function installUpdate(): void {
  autoUpdater.quitAndInstall()
}
