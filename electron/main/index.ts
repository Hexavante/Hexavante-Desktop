import { app, BrowserWindow } from 'electron'
import { createWindow } from './window'
import { setupSecurity } from './security'
import { registerAllIpc } from './ipc'
import { setupUpdater } from './services/updater.service'
import { setupLogger, getLogger } from './services/logger.service'
import { start as startMenu } from './menus/app-menu'

let mainWindow: BrowserWindow | null = null

// AMD GPU optimizations for Linux/Windows
if (process.platform === 'linux' || process.platform === 'win32') {
  // Disable GPU sandbox for better AMD compatibility
  app.commandLine.appendSwitch('disable-gpu-sandbox')
  // Enable hardware acceleration
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  // Use Vulkan for AMD on Linux
  if (process.platform === 'linux') {
    app.commandLine.appendSwitch('use-vulkan', 'native')
  }
  // Disable GPU vsync for better performance on AMD
  app.commandLine.appendSwitch('disable-gpu-vsync')
}

app.whenReady().then(() => {
  setupLogger()
  getLogger().info('Starting Hexavante Desktop...')

  setupSecurity()
  registerAllIpc()

  mainWindow = createWindow()
  startMenu()

  setupUpdater(mainWindow)
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('before-quit', () => {
  getLogger().info('Quitting Hexavante Desktop...')
})

process.on('uncaughtException', error => {
  getLogger().error('Uncaught exception:', error.message, error.stack)
})

process.on('unhandledRejection', reason => {
  getLogger().error('Unhandled rejection:', String(reason))
})
