export interface AuthUser {
  id: string
  name: string
  email: string
  username: string
  roles: string[]
  isPremium?: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  fullName: string
  email: string
  password: string
  birthDate: string
}

export interface SessionResponse {
  user: AuthUser
}

export type UserRole = 'admin' | 'instructor' | 'student'
