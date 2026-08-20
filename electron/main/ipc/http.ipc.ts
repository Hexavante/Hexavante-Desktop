import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../utils/channels'
import { getLogger } from '../services/logger.service'

const PRODUCTION_API_URL = 'https://api.hexavante.com.br'

interface HttpRequestPayload {
  method: string
  url: string
  headers?: Record<string, string>
  body?: unknown
}

function resolveApiUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const isLocalApi =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '187.127.54.55'
    if (isLocalApi && parsed.port === '3045') {
      return `${PRODUCTION_API_URL}${parsed.pathname}${parsed.search}`
    }
    return url
  } catch {
    return url
  }
}

export function registerHttpIpc(): void {
  ipcMain.handle(IPC_CHANNELS.HTTP_REQUEST, async (_event, payload: HttpRequestPayload) => {
    const { method, headers = {}, body } = payload
    const url = resolveApiUrl(payload.url)

    const fetchHeaders = new Headers()
    for (const [key, value] of Object.entries(headers)) {
      if (value) fetchHeaders.set(key, value)
    }

    try {
      const response = await fetch(url, {
        method,
        headers: fetchHeaders,
        body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
      })

      const responseHeaders: Record<string, string | string[]> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })
      const setCookies = response.headers.getSetCookie?.()
      if (setCookies?.length) {
        responseHeaders['set-cookie'] = setCookies
      }

      const responseBody = await response.text()

      getLogger().debug(
        `[http:request] ${method} ${url} => ${response.status} | ct=${responseHeaders['content-type']} | body=${responseBody.slice(0, 160)}`
      )

      return {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
      }
    } catch (error) {
      getLogger().error('http:request failed', error)
      throw new Error(`Falha na requisição HTTP: ${error instanceof Error ? error.message : String(error)}`)
    }
  })
}