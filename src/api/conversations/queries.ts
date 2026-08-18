import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { conversationsApi } from './api'
import { useAuthStore } from '@/app/stores/auth.store'
import { staleTimes } from '@/app/queries/options'
import { toast } from 'sonner'

export function useInbox() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.conversations.inbox,
    queryFn: () => conversationsApi.getInbox(),
    enabled: isAuthenticated,
    staleTime: staleTimes.FAST,
    refetchInterval: 30000,
  })
}

export function useConversationMessages(conversationId: string, params?: { since?: string; limit?: number }) {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId, params),
    queryFn: () => conversationsApi.getMessages(conversationId, params),
    enabled: isAuthenticated && !!conversationId,
    staleTime: staleTimes.FAST,
    refetchInterval: 5000,
  })
}

export function useCreateConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { recipientUserId?: string; username?: string }) => conversationsApi.createConversation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.inbox })
      toast.success('Conversa iniciada')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao iniciar conversa')
    },
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: string; body: string }) =>
      conversationsApi.sendMessage(conversationId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.messages(variables.conversationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.inbox })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar mensagem')
    },
  })
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) => conversationsApi.markAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.inbox })
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.messages(conversationId) })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao marcar como lida')
    },
  })
}