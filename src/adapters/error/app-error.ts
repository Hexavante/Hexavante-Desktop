import type { ApiErrorCode } from '@/domain/enums/api-errors.enum'

export class AppError extends Error {
  public readonly code: ApiErrorCode
  public readonly status: number
  public readonly fields?: Record<string, string>
  public readonly details?: unknown

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    fields?: Record<string, string>,
    details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.fields = fields
    this.details = details
  }

  static validation(message: string, fields?: Record<string, string>) {
    return new AppError('VALIDATION_ERROR', message, 422, fields)
  }

  static unauthorized(message = 'Não autorizado') {
    return new AppError('UNAUTHORIZED', message, 401)
  }

  static forbidden(message = 'Acesso negado') {
    return new AppError('FORBIDDEN', message, 403)
  }

  static notFound(message = 'Recurso não encontrado') {
    return new AppError('NOT_FOUND', message, 404)
  }

  static conflict(message: string) {
    return new AppError('CONFLICT', message, 409)
  }

  static serverError(message = 'Erro interno do servidor') {
    return new AppError('SERVER_ERROR', message, 500)
  }

  static network(message = 'Sem conexão com o servidor') {
    return new AppError('NETWORK_ERROR', message, 0)
  }

  static timeout(message = 'Tempo limite excedido') {
    return new AppError('TIMEOUT', message, 0)
  }
}
