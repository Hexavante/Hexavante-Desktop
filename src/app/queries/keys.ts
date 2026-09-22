export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
    permissions: ['auth', 'permissions'] as const
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
