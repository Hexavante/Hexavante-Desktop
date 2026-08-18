import { AxiosError } from 'axios'
import { AppError } from './app-error'

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof AxiosError) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return AppError.timeout()
      }
      return AppError.network()
    }

    const { status, data } = error.response

    if (status === 401) {
      return AppError.unauthorized(data?.message)
    }

    if (status === 403) {
      return AppError.forbidden(data?.message)
    }

    if (status === 404) {
      return AppError.notFound(data?.message)
    }

    if (status === 409) {
      return AppError.conflict(data?.message || 'Conflito')
    }

    if (status === 422) {
      return AppError.validation(
        data?.message || 'Dados inválidos',
        data?.fields
      )
    }

    if (status >= 500) {
      return AppError.serverError(data?.message)
    }

    return AppError.serverError(data?.message || 'Erro desconhecido')
  }

  if (error instanceof Error) {
    return AppError.serverError(error.message)
  }

  return AppError.serverError('Erro desconhecido')
}
