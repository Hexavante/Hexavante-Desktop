import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../main/utils/channels'
import type { ElectronAPI } from '../../src/types/electron'

const electronAPI: ElectronAPI = {
  auth: {
    saveRefreshToken: (token: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.AUTH_SAVE_REFRESH_TOKEN, token),
    getRefreshToken: () => ipcRenderer.invoke(IPC_CHANNELS.AUTH_GET_REFRESH_TOKEN),
    clearRefreshToken: () => ipcRenderer.invoke(IPC_CHANNELS.AUTH_CLEAR_REFRESH_TOKEN),
    oauth: (provider: string, apiUrl: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.AUTH_OAUTH, provider, apiUrl)
  },
  updater: {
    check: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER_CHECK),
    download: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER_DOWNLOAD),
    install: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER_INSTALL),
    onProgress: callback => {
      ipcRenderer.on(IPC_CHANNELS.UPDATER_ON_PROGRESS, (_event, progress) => callback(progress))
    },
    onAvailable: callback => {
      ipcRenderer.on(IPC_CHANNELS.UPDATER_ON_AVAILABLE, (_event, info) => callback(info))
    },
    onDownloaded: callback => {
      ipcRenderer.on(IPC_CHANNELS.UPDATER_ON_DOWNLOADED, () => callback())
    },
    removeListeners: () => {
      ipcRenderer.removeAllListeners(IPC_CHANNELS.UPDATER_ON_PROGRESS)
      ipcRenderer.removeAllListeners(IPC_CHANNELS.UPDATER_ON_AVAILABLE)
      ipcRenderer.removeAllListeners(IPC_CHANNELS.UPDATER_ON_DOWNLOADED)
    }
  },
  storage: {
    get: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.STORAGE_GET, key),
    set: (key: string, value: unknown) =>
      ipcRenderer.invoke(IPC_CHANNELS.STORAGE_SET, { key, value }),
    delete: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.STORAGE_DELETE, key)
  },
  window: {
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE),
    close: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE),
    isMaximized: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_MAXIMIZED)
  },
  system: {
    getInfo: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_INFO)
  },
  dialog: {
    openFile: (options?) => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_FILE, options),
    saveFile: (options?) => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_SAVE_FILE, options),
    confirm: (options) => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_CONFIRM, options)
  },
  shell: {
    openExternal: (url: string) => ipcRenderer.invoke(IPC_CHANNELS.SHELL_OPEN_EXTERNAL, url),
    openPath: (path: string) => ipcRenderer.invoke(IPC_CHANNELS.SHELL_OPEN_PATH, path)
  },
  log: {
    write: (entry) => ipcRenderer.invoke(IPC_CHANNELS.LOG_WRITE, entry)
  },
  app: {
    getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION)
  },
  notificacao: {
    show: (title: string, body: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATION_SHOW, title, body)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
