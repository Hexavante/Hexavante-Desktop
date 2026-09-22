export const APP_NAME = 'Hexavante'

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  CURSOS: '/cursos',
  CURSO_DETALHE: (id: string) => `/cursos/${id}`,
  PERFIL: '/perfil',
  CONFIGURACOES: '/configuracoes',
} as const
