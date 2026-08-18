import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  PermissionContext,
  PermissionCheckResult,
  Permission,
  Role,
  CreatePermissionRequest,
  CreateRoleRequest,
} from '@/domain/types/authorization.types'

export const authorizationService = {
  async getContext(): Promise<PermissionContext> {
    const { data } = await api.get<PermissionContext>(ENDPOINTS.AUTHORIZATION.CONTEXT)
    return data
  },

  async checkPermission(permission: string): Promise<PermissionCheckResult> {
    const { data } = await api.get<PermissionCheckResult>(
      ENDPOINTS.AUTHORIZATION.CHECK(permission)
    )
    return data
  },

  async listPermissions(): Promise<Permission[]> {
    const { data } = await api.get<{ permissions: Permission[] }>(
      ENDPOINTS.AUTHORIZATION.PERMISSIONS_LIST
    )
    return data.permissions
  },

  async listRoles(): Promise<Role[]> {
    const { data } = await api.get<{ roles: Role[] }>(ENDPOINTS.AUTHORIZATION.ROLES)
    return data.roles
  },

  async createPermission(body: CreatePermissionRequest): Promise<Permission> {
    const { data } = await api.post<{ permission: Permission }>(
      ENDPOINTS.AUTHORIZATION.PERMISSIONS,
      body
    )
    return data.permission
  },

  async createRole(body: CreateRoleRequest): Promise<Role> {
    const { data } = await api.post<{ role: Role }>(ENDPOINTS.AUTHORIZATION.ROLES, body)
    return data.role
  },
}
