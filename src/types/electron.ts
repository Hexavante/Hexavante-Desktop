export interface ElectronAPI {
  auth: {
    saveRefreshToken: (token: string) => Promise<void>
    getRefreshToken: () => Promise<string | null>
    clearRefreshToken: () => Promise<void>
    oauth: (provider: string, apiUrl: string) => Promise<string>
  }
  updater: {
    check: () => Promise<UpdateInfo | null>
    download: () => Promise<void>
    install: () => Promise<void>
    onProgress: (callback: (progress: ProgressInfo) => void) => void
    onAvailable: (callback: (info: UpdateInfo) => void) => void
    onDownloaded: (callback: () => void) => void
    removeListeners: () => void
  }
  storage: {
    get: (key: string) => Promise<unknown>
    set: (key: string, value: unknown) => Promise<void>
    delete: (key: string) => Promise<void>
  }
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    isMaximized: () => Promise<boolean>
  }
  system: {
    getInfo: () => Promise<SystemInfo>
  }
  dialog: {
    openFile: (options?: OpenDialogOptions) => Promise<string[] | null>
    saveFile: (options?: SaveDialogOptions) => Promise<string | null>
    confirm: (options: ConfirmOptions) => Promise<boolean>
  }
  shell: {
    openExternal: (url: string) => Promise<void>
    openPath: (path: string) => Promise<void>
  }
  log: {
    write: (entry: LogEntry) => Promise<void>
  }
  app: {
    getVersion: () => Promise<string>
  }
  notificacao: {
    show: (title: string, body: string) => Promise<void>
  }
}

export interface UpdateInfo {
  version: string
  releaseDate: string
  releaseNotes?: string
}

export interface ProgressInfo {
  percent: number
  bytesPerSecond: number
  total: number
  transferred: number
}

export interface SystemInfo {
  platform: string
  arch: string
  version: string
  electronVersion: string
}

export interface OpenDialogOptions {
  title?: string
  filters?: Array<{ name: string; extensions: string[] }>
  multiple?: boolean
}

export interface SaveDialogOptions {
  title?: string
  filters?: Array<{ name: string; extensions: string[] }>
  defaultPath?: string
}

export interface ConfirmOptions {
  title: string
  message: string
  detail?: string
  type?: 'none' | 'info' | 'error' | 'question' | 'warning'
}

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  data?: unknown
  timestamp: string
  source: 'renderer'
}
