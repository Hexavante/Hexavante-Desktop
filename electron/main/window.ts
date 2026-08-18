import { BrowserWindow, shell } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { loadWindowState, saveWindowState } from './services/window-state.service'
import { getLogger } from './services/logger.service'

export function createWindow(): BrowserWindow {
  const windowState = loadWindowState()

  const mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 1024,
    minHeight: 600,
    show: false,
    center: true,
    title: 'Hexavante',
    // AMD GPU optimizations
    backgroundColor: '#06080f',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      zoomFactor: 1.0,
    },
  })

  mainWindow.webContents.on('before-input-event', (_event, input) => {
    if ((input.control || input.meta) && (input.key === '=' || input.key === '-' || input.key === '0')) {
      _event.preventDefault()
    }
  })

  mainWindow.on('ready-to-show', () => {
    getLogger().info('Window ready-to-show')
    mainWindow.webContents.setZoomLevel(0)
    if (windowState.isMaximized) {
      mainWindow.maximize()
    }
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    getLogger().info('Window closed')
  })

  mainWindow.on('resize', () => {
    saveWindowState(mainWindow)
  })

  mainWindow.on('move', () => {
    saveWindowState(mainWindow)
  })

  mainWindow.webContents.on('did-finish-load', () => {
    getLogger().info('Renderer did-finish-load')
  })

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    getLogger().error(`Renderer did-fail-load: ${errorCode} - ${errorDescription}`)
  })

  mainWindow.webContents.on('render-process-gone', (_event: Electron.Event, details: Electron.RenderProcessGoneDetails) => {
    getLogger().error({ details }, 'Renderer process gone')
  })

  mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    const levelNames = ['verbose', 'info', 'warning', 'error']
    getLogger().info(`[Renderer ${levelNames[level] || level}] ${message} (${sourceId}:${line})`)
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
