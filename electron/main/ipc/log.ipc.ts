import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'
import { LogEntrySchema } from '../utils/schemas'
import { getLogger } from '../services/logger.service'

export function registerLogIpc(): void {
  ipcMain.handle(IPC_CHANNELS.LOG_WRITE, async (_event, entry: unknown) => {
    const parsed = LogEntrySchema.safeParse(entry)
    if (!parsed.success) {
      throw new Error('Invalid log entry')
    }
    const log = getLogger()
    const { level, message, data } = parsed.data
    log[level](message, data)
  })
}
