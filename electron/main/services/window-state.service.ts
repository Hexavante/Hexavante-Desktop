import ElectronStore from 'electron-store'
import { BrowserWindow, screen } from 'electron'

interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
}

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 800
const MIN_WIDTH = 1024
const MIN_HEIGHT = 600

let store: ElectronStore<WindowState>

function getStore(): ElectronStore<WindowState> {
  if (!store) {
    store = new ElectronStore<WindowState>({
      name: 'window-state',
      defaults: {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        isMaximized: false
      }
    })
  }
  return store
}

export function loadWindowState(): Partial<Electron.Rectangle> & { isMaximized?: boolean } {
  const saved = getStore().store

  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  return {
    x: saved.x,
    y: saved.y,
    width: Math.min(saved.width || DEFAULT_WIDTH, width),
    height: Math.min(saved.height || DEFAULT_HEIGHT, height),
    isMaximized: saved.isMaximized
  }
}

export function saveWindowState(window: BrowserWindow): void {
  const isMaximized = window.isMaximized()
  if (!isMaximized) {
    const bounds = window.getBounds()
    getStore().set({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: false
    })
  } else {
    getStore().set({ isMaximized: true })
  }
}
