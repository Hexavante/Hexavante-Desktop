import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { notificationsApi } from './api'
import { useAuthStore } from '@/app/stores/auth.store'
import { staleTimes } from '@/app/queries/options'
import { toast } from 'sonner'

export function useNotifications(params?: { limit?: number; unreadOnly?: boolean }) {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationsApi.getNotifications(params),
    enabled: isAuthenticated,
    staleTime: staleTimes.FAST,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useUnreadNotificationCount() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: async () => {
      const response = await notificationsApi.getNotifications({ limit: 1 })
      return response.unreadCount
    },
    enabled: isAuthenticated,
    staleTime: staleTimes.FAST,
    refetchInterval: 30000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao marcar como lida')
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
      toast.success('Todas as notificações marcadas como lidas')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao marcar todas como lidas')
    },
  })
}