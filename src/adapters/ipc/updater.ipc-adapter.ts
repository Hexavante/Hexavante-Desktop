import type { ProgressInfo, UpdateInfo } from '@/types/electron'

function getUpdaterApi() {
  return window.electronAPI?.updater
}

export const updaterIpc = {
  check: async (): Promise<UpdateInfo | null> => {
    const api = getUpdaterApi()
    return api ? api.check() : null
  },
  download: async (): Promise<void> => {
    const api = getUpdaterApi()
    if (api) await api.download()
  },
  install: async (): Promise<void> => {
    const api = getUpdaterApi()
    if (api) await api.install()
  },
  onProgress: (callback: (progress: ProgressInfo) => void): void => {
    getUpdaterApi()?.onProgress(callback)
  },
  onAvailable: (callback: (info: UpdateInfo) => void): void => {
    getUpdaterApi()?.onAvailable(callback)
  },
  onDownloaded: (callback: () => void): void => {
    getUpdaterApi()?.onDownloaded(callback)
  },
  removeListeners: (): void => {
    getUpdaterApi()?.removeListeners()
  }
}
