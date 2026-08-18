export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description: string | null
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface PermissionContext {
  userId: string
  roles: string[]
  permissions: string[]
  directPermissions: string[]
}

export interface PermissionCheckResult {
  granted: boolean
  reason: 'role' | 'direct' | 'denied'
}

export interface CreatePermissionRequest {
  name: string
  resource: string
  action: string
  description?: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
  permissionIds?: string[]
}
