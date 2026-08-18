import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { authorizationService } from '@/services/authorization.service'
import { useAuthStore } from '@/app/stores/auth.store'
import { staleTimes } from '@/app/queries/options'

export function useAuthorizationContext() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.authorization.context,
    queryFn: () => authorizationService.getContext(),
    enabled: isAuthenticated,
    staleTime: staleTimes.SLOW,
  })
}

export function useCheckPermission(permission: string) {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.authorization.check(permission),
    queryFn: () => authorizationService.checkPermission(permission),
    enabled: isAuthenticated && !!permission,
    staleTime: staleTimes.SLOW,
  })
}

export function usePermissionsList() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.authorization.permissions,
    queryFn: () => authorizationService.listPermissions(),
    enabled: isAuthenticated,
    staleTime: staleTimes.LAZY,
  })
}

export function useRolesList() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.authorization.roles,
    queryFn: () => authorizationService.listRoles(),
    enabled: isAuthenticated,
    staleTime: staleTimes.LAZY,
  })
}
