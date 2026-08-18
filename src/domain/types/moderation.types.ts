export type ModerationUserStatus = 'active' | 'banned' | 'muted'

export interface ModerationUser {
  id: string
  username: string | null
  fullName: string | null
  email: string
  avatarUrl: string | null
  level: number
  xp: number
  coins: number
  roles: string[]
  isBanned: boolean
  isMuted: boolean
  warnings: number
  createdAt: string
  lastLogin: string | null
}

export interface ModerationActivityDay {
  date: string
  usuarios: number
  simulados: number
  xpGanho: number
}

export interface ModerationStats {
  activeToday: number
  activeBans: number
  activeMutes: number
  pendingReports: number
  newMessages: number
  xpToday: number
  totalCoins: number
  totalUsers: number
  pendingCourses: number
  pendingApplications: number
  activityData: ModerationActivityDay[]
}

export interface ModerationActionRequest {
  reason: string
  durationHours?: number
}

export const MODERATION_STATUS_LABELS: Record<ModerationUserStatus, string> = {
  active: 'Ativo',
  banned: 'Banido',
  muted: 'Silenciado',
}

export const ROLES_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  MODERATOR: 'Moderador',
  INSTRUCTOR: 'Instrutor',
  USER: 'Usuário',
}