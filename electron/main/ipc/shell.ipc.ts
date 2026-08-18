import { ipcMain, shell, app } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'
import { UrlSchema, PathSchema } from '../utils/schemas'

export function registerShellIpc(): void {
  ipcMain.handle(IPC_CHANNELS.SHELL_OPEN_EXTERNAL, async (_event, url: unknown) => {
    const parsed = UrlSchema.safeParse(url)
    if (!parsed.success) {
      throw new Error('Invalid URL')
    }
    await shell.openExternal(parsed.data)
  })

  ipcMain.handle(IPC_CHANNELS.SHELL_OPEN_PATH, async (_event, filePath: unknown) => {
    const parsed = PathSchema.safeParse(filePath)
    if (!parsed.success) {
      throw new Error('Invalid path')
    }
    await shell.openPath(parsed.data)
  })
}
