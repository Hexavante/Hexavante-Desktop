import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { AxiosError } from 'axios'

interface HttpIpcResponse {
  status: number
  statusText: string
  headers: Record<string, string | string[]>
  body: string
}

function headersToPlain(headers: InternalAxiosRequestConfig['headers']): Record<string, string> {
  const result: Record<string, string> = {}
  if (!headers) return result

  const headersAny = headers as unknown as {
    forEach?: (cb: (value: string, key: string) => void) => void
  }

  if (typeof headersAny.forEach === 'function') {
    headersAny.forEach((value, key) => {
      result[key] = value
    })
  } else {
    Object.entries(headersAny).forEach(([key, value]) => {
      if (typeof value === 'string') result[key] = value
    })
  }
  return result
}

export function createIpcHttpAdapter(): AxiosAdapter {
  return async function ipcHttpAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    const api = window.electronAPI?.http
    if (!api) {
      throw new Error('Electron HTTP API não disponível')
    }

    const url = config.url?.startsWith('http')
      ? config.url
      : new URL(config.url || '/', config.baseURL || undefined).toString()

    const headers = headersToPlain(config.headers)

    const payload = {
      method: (config.method || 'get').toUpperCase(),
      url,
      headers,
      body: config.data,
    }

    const response: HttpIpcResponse = await api.request(payload)

    const contentType = response.headers['content-type'] as string | undefined
    let data: unknown = response.body
    if (contentType?.includes('application/json') && response.body) {
      try {
        data = JSON.parse(response.body)
      } catch {
        data = response.body
      }
    }

    const axiosResponse: AxiosResponse = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as AxiosResponse['headers'],
      config,
      request: {},
    }

    // Axios custom adapters bypass the built-in validateStatus check.
    // Enforce it here so non-2xx responses reject (matching built-in adapter behavior).
    const validateStatus = config.validateStatus
    if (validateStatus && !validateStatus(response.status)) {
      const code = response.status >= 400 && response.status < 500
        ? AxiosError.ERR_BAD_REQUEST
        : AxiosError.ERR_BAD_RESPONSE
      throw new AxiosError(
        `Request failed with status code ${response.status}`,
        code,
        config,
        axiosResponse.request,
        axiosResponse,
      )
    }

    return axiosResponse
  }
}