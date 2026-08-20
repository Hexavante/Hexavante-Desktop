import axios from 'axios'
import { httpConfig } from './config'
import { authRequestInterceptor } from './interceptors/auth.request'
import { authResponseInterceptor } from './interceptors/auth.response'
import {
  loggingRequestInterceptor,
  loggingResponseInterceptor,
} from './interceptors/logging'
import { errorResponseInterceptor } from './interceptors/error'
import { createIpcHttpAdapter } from './ipc-adapter'

export const api = axios.create({
  baseURL: httpConfig.baseURL,
  timeout: httpConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  adapter: typeof window !== 'undefined' && window.electronAPI?.http
    ? createIpcHttpAdapter()
    : undefined,
})

api.interceptors.request.use(authRequestInterceptor)
api.interceptors.request.use(loggingRequestInterceptor)

api.interceptors.response.use(authResponseInterceptor)
api.interceptors.response.use(loggingResponseInterceptor, errorResponseInterceptor)
