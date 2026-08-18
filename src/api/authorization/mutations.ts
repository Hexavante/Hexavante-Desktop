import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authorizationService } from '@/services/authorization.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'
import type { CreatePermissionRequest, CreateRoleRequest } from '@/domain/types/authorization.types'

export function useCreatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) => authorizationService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authorization.permissions })
      toast.success('Permissão criada!')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => authorizationService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authorization.roles })
      toast.success('Função criada!')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}
