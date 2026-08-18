import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { communityService, type CreateDiscussionInput } from '@/services/community.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'

export function useCreateDiscussion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDiscussionInput) => communityService.createDiscussion(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] })
      toast.success('Publicação criada!')
    },
    onError: (error) => {
      toast.error(normalizeError(error).message)
    },
  })
}

export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (activityId: string) => communityService.toggleLike(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] })
    },
    onError: (error) => {
      toast.error(normalizeError(error).message)
    },
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ activityId, content }: { activityId: string; content: string }) =>
      communityService.addComment(activityId, content),
    onSuccess: (_data, { activityId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.comments(activityId) })
      queryClient.invalidateQueries({ queryKey: ['community'] })
      toast.success('Comentário adicionado!')
    },
    onError: (error) => {
      toast.error(normalizeError(error).message)
    },
  })
}

export function useToggleFollow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => communityService.toggleFollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.suggestedUsers })
    },
    onError: (error) => {
      toast.error(normalizeError(error).message)
    },
  })
}
