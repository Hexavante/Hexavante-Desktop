export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  link: string | null
  readAt: string | null
  createdAt: string
}

export interface NotificationsResponse {
  success: true
  notifications: Notification[]
  unreadCount: number
}

export interface MarkReadResponse {
  success: true
}

export interface NotificationsQuery {
  limit?: number
  unreadOnly?: boolean
}