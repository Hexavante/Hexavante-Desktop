import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type { Notification, NotificationsResponse, MarkReadResponse, NotificationsQuery } from './types'

export const notificationsApi = {
  async getNotifications(params?: NotificationsQuery): Promise<NotificationsResponse> {
    const { data } = await api.get<NotificationsResponse>(ENDPOINTS.NOTIFICATIONS.LIST, { params })
    return data
  },

  async markAsRead(id: string): Promise<MarkReadResponse> {
    const { data } = await api.patch<MarkReadResponse>(ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
    return data
  },

  async markAllAsRead(): Promise<MarkReadResponse> {
    const { data } = await api.patch<MarkReadResponse>(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    return data
  },
}