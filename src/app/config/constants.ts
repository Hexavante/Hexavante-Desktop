export const APP_NAME = 'Hexavante'

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  CURSOS: '/cursos',
  CURSO_DETALHE: (id: string) => `/cursos/${id}`,
  PERFIL: '/perfil',
  PRODUTOS: '/produtos',
  PRODUTO_NOVO: '/produtos/novo',
  PRODUTO_EDITAR: (id: number) => `/produtos/${id}/editar`,
  PRODUTO_DETALHE: (id: number) => `/produtos/${id}`,
  CLIENTES: '/clientes',
  CLIENTE_NOVO: '/clientes/novo',
  CLIENTE_EDITAR: (id: number) => `/clientes/${id}/editar`,
  CLIENTE_DETALHE: (id: number) => `/clientes/${id}`,
  PEDIDOS: '/pedidos',
  PEDIDO_NOVO: '/pedidos/novo',
  PEDIDO_DETALHE: (id: number) => `/pedidos/${id}`,
  CONFIGURACOES: '/configuracoes',
} as const
