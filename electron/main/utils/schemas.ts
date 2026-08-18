import { z } from 'zod'

export const RefreshTokenSchema = z.string().min(1)

export const StorageKeySchema = z.string().min(1)

export const StorageSetSchema = z.object({
  key: z.string().min(1),
  value: z.unknown()
})

export const LogEntrySchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string().min(1),
  data: z.unknown().optional(),
  timestamp: z.string(),
  source: z.literal('renderer')
})

export const OpenDialogOptionsSchema = z.object({
  title: z.string().optional(),
  filters: z
    .array(
      z.object({
        name: z.string(),
        extensions: z.array(z.string())
      })
    )
    .optional(),
  multiple: z.boolean().optional()
})

export const SaveDialogOptionsSchema = z.object({
  title: z.string().optional(),
  filters: z
    .array(
      z.object({
        name: z.string(),
        extensions: z.array(z.string())
      })
    )
    .optional(),
  defaultPath: z.string().optional()
})

export const ConfirmOptionsSchema = z.object({
  title: z.string(),
  message: z.string(),
  detail: z.string().optional(),
  type: z.enum(['none', 'info', 'error', 'question', 'warning']).optional()
})

export const UrlSchema = z.string().url()

export const PathSchema = z.string().min(1)
