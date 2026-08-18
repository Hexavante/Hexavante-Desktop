export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
    permissions: ['auth', 'permissions'] as const
  },
  produtos: {
    all: ['produtos'] as const,
    lists: () => [...queryKeys.produtos.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.produtos.lists(), filters].filter(Boolean) as readonly unknown[],
    details: () => [...queryKeys.produtos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.produtos.details(), id] as const
  },
  clientes: {
    all: ['clientes'] as const,
    lists: () => [...queryKeys.clientes.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.clientes.lists(), filters].filter(Boolean) as readonly unknown[],
    details: () => [...queryKeys.clientes.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.clientes.details(), id] as const
  },
  pedidos: {
    all: ['pedidos'] as const,
    lists: () => [...queryKeys.pedidos.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.pedidos.lists(), filters].filter(Boolean) as readonly unknown[],
    details: () => [...queryKeys.pedidos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.pedidos.details(), id] as const
  },
  dashboard: {
    data: ['dashboard'] as const,
    stats: (periodo?: string) => ['dashboard', 'stats', periodo].filter(Boolean) as readonly unknown[]
  },
  configuracoes: {
    all: ['configuracoes'] as const,
    list: () => [...queryKeys.configuracoes.all, 'list'] as const
  }
}
