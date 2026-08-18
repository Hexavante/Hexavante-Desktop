import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export function loggingRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (import.meta.env.DEV) {
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  }
  return config
}

export function loggingResponseInterceptor(response: AxiosResponse) {
  if (import.meta.env.DEV) {
    console.debug(`[API] ${response.status} ${response.config.url}`)
  }
  return response
}
