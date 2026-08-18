import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userService } from '@/services/user.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'
import type { UpdateProfileRequest } from '@/domain/types/user.types'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile })
      toast.success('Perfil atualizado!')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => userService.deleteAccount(),
    onSuccess: () => {
      queryClient.clear()
      toast.success('Conta removida')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}
