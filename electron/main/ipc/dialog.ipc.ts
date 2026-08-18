import { ipcMain, dialog } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'
import { OpenDialogOptionsSchema, SaveDialogOptionsSchema, ConfirmOptionsSchema } from '../utils/schemas'

export function registerDialogIpc(): void {
  ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_FILE, async (_event, options: unknown) => {
    const parsed = OpenDialogOptionsSchema.safeParse(options)
    const opts = parsed.success ? parsed.data : {}
    const result = await dialog.showOpenDialog({
      title: opts.title,
      filters: opts.filters,
      properties: opts.multiple ? ['multiSelections'] : undefined
    })
    return result.canceled ? null : result.filePaths
  })

  ipcMain.handle(IPC_CHANNELS.DIALOG_SAVE_FILE, async (_event, options: unknown) => {
    const parsed = SaveDialogOptionsSchema.safeParse(options)
    const opts = parsed.success ? parsed.data : {}
    const result = await dialog.showSaveDialog({
      title: opts.title,
      filters: opts.filters,
      defaultPath: opts.defaultPath
    })
    return result.canceled ? null : result.filePath
  })

  ipcMain.handle(IPC_CHANNELS.DIALOG_CONFIRM, async (_event, options: unknown) => {
    const parsed = ConfirmOptionsSchema.safeParse(options)
    if (!parsed.success) {
      throw new Error('Invalid confirm options')
    }
    const result = await dialog.showMessageBox({
      type: parsed.data.type || 'question',
      title: parsed.data.title,
      message: parsed.data.message,
      detail: parsed.data.detail,
      buttons: ['Cancelar', 'Confirmar'],
      defaultId: 1,
      cancelId: 0
    })
    return result.response === 1
  })
}
