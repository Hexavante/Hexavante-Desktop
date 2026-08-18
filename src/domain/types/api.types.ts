export interface ApiError {
  success: false
  error: string
  code?: string
}

export interface ApiValidationError {
  success: false
  message: string
  errors: FieldError[]
}

export interface FieldError {
  field: string
  message: string
}

export interface ApiSuccess {
  success: true
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
}
