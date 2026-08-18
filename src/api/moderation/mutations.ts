import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { moderationService } from '@/services/moderation.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'
import type { ModerationActionRequest } from '@/domain/types/moderation.types'

function invalidateUsers(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.moderation.users() })
  queryClient.invalidateQueries({ queryKey: queryKeys.moderation.stats })
}

export function useBanUser(onDone?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { userId: string; body: ModerationActionRequest }) =>
      moderationService.ban(vars.userId, vars.body),
    onSuccess: () => {
      invalidateUsers(queryClient)
      toast.success('Usuário banido')
      onDone?.()
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useUnbanUser(onDone?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => moderationService.unban(userId),
    onSuccess: () => {
      invalidateUsers(queryClient)
      toast.success('Banimento revogado')
      onDone?.()
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useMuteUser(onDone?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { userId: string; body: ModerationActionRequest }) =>
      moderationService.mute(vars.userId, vars.body),
    onSuccess: () => {
      invalidateUsers(queryClient)
      toast.success('Usuário silenciado')
      onDone?.()
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useUnmuteUser(onDone?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => moderationService.unmute(userId),
    onSuccess: () => {
      invalidateUsers(queryClient)
      toast.success('Silenciamento revogado')
      onDone?.()
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useWarnUser(onDone?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { userId: string; body: ModerationActionRequest }) =>
      moderationService.warn(vars.userId, vars.body),
    onSuccess: () => {
      invalidateUsers(queryClient)
      toast.success('Advertência registrada')
      onDone?.()
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}