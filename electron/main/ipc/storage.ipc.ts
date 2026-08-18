import { ipcMain } from 'electron'
import ElectronStore from 'electron-store'
import { IPC_CHANNELS } from '../utils/channels'
import { StorageKeySchema, StorageSetSchema } from '../utils/schemas'

const store = new ElectronStore({
  name: 'hexavante-config',
  defaults: {}
})

export function registerStorageIpc(): void {
  ipcMain.handle(IPC_CHANNELS.STORAGE_GET, async (_event, key: unknown) => {
    const parsed = StorageKeySchema.safeParse(key)
    if (!parsed.success) {
      throw new Error('Invalid key')
    }
    return store.get(parsed.data)
  })

  ipcMain.handle(IPC_CHANNELS.STORAGE_SET, async (_event, data: unknown) => {
    const parsed = StorageSetSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error('Invalid storage data')
    }
    store.set(parsed.data.key, parsed.data.value)
  })

  ipcMain.handle(IPC_CHANNELS.STORAGE_DELETE, async (_event, key: unknown) => {
    const parsed = StorageKeySchema.safeParse(key)
    if (!parsed.success) {
      throw new Error('Invalid key')
    }
    store.delete(parsed.data)
  })
}
