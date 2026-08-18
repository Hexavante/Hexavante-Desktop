import { Suspense } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  DashboardPage,
  CursosListPage,
  CursoDetailPage,
  CursoLearnPage,
  LessonLearnPage,
  InstructorCoursesPage,
  InstructorApplyPage,
  InstructorNewCoursePage,
  LiveRoomsPage,
  LiveRoomDetailPage,
  ModerationPage,
  PerfilPage,
  PerfilPublicoPage,
  RankingPage,
  EstatisticasPage,
  ConfiguracoesPage,
  SimuladosPage,
  SimuladosHistoricoPage,
  SimuladoDetailPage,
  SimuladoFazerPage,
  SimuladoResultadoPage,
  ComunidadePage,
  LojaPage,
  InventarioPage,
  AdminPage,
  CertificadosPage,
  VerificarCertificadoPage,
  CertificadoDetailPage,
  NotificacoesPage,
  MensagensPage,
  MensagemDetailPage,
} from './lazy'

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
}

function AuthPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
}

function AppPage({ children }: { children: React.ReactNode }) {
  return <AppShell><Suspense fallback={<LoadingScreen />}>{children}</Suspense></AppShell>
}

const router = createHashRouter([
  { path: '/', element: <AppPage><DashboardPage /></AppPage>, index: true },
  { path: 'cursos', element: <AppPage><CursosListPage /></AppPage> },
  { path: 'cursos/:id', element: <AppPage><CursoDetailPage /></AppPage> },
  { path: 'cursos/:id/learn', element: <AppPage><CursoLearnPage /></AppPage> },
  { path: 'cursos/:id/learn/:lessonId', element: <AppPage><LessonLearnPage /></AppPage> },
  { path: 'instrutor', element: <AppPage><InstructorCoursesPage /></AppPage> },
  { path: 'instrutor/solicitar', element: <AppPage><InstructorApplyPage /></AppPage> },
  { path: 'instrutor/cursos/novo', element: <AppPage><InstructorNewCoursePage /></AppPage> },
  { path: 'live', element: <AppPage><LiveRoomsPage /></AppPage> },
  { path: 'live/:id', element: <AppPage><LiveRoomDetailPage /></AppPage> },
  { path: 'perfil', element: <AppPage><PerfilPage /></AppPage> },
  { path: 'perfil/:username', element: <AppPage><PerfilPublicoPage /></AppPage> },
  { path: 'ranking', element: <AppPage><RankingPage /></AppPage> },
  { path: 'estatisticas', element: <AppPage><EstatisticasPage /></AppPage> },
  { path: 'configuracoes', element: <AppPage><ConfiguracoesPage /></AppPage> },
  { path: 'simulados', element: <AppPage><SimuladosPage /></AppPage> },
  { path: 'simulados/historico', element: <AppPage><SimuladosHistoricoPage /></AppPage> },
  { path: 'simulados/:slug', element: <AppPage><SimuladoDetailPage /></AppPage> },
  { path: 'simulados/:slug/fazer/:attemptId', element: <AppPage><SimuladoFazerPage /></AppPage> },
  { path: 'simulados/:slug/resultado/:attemptId', element: <AppPage><SimuladoResultadoPage /></AppPage> },
  { path: 'comunidade', element: <AppPage><ComunidadePage /></AppPage> },
  { path: 'loja', element: <AppPage><LojaPage /></AppPage> },
  { path: 'inventario', element: <AppPage><InventarioPage /></AppPage> },
  { path: 'admin', element: <AppPage><AdminPage /></AppPage> },
  { path: 'moderacao', element: <AppPage><ModerationPage /></AppPage> },
  { path: 'certificados', element: <AppPage><CertificadosPage /></AppPage> },
  { path: 'certificados/verificar', element: <AppPage><VerificarCertificadoPage /></AppPage> },
  { path: 'certificados/c/:code', element: <AppPage><CertificadoDetailPage /></AppPage> },
  { path: 'notificacoes', element: <AppPage><NotificacoesPage /></AppPage> },
  { path: 'mensagens', element: <AppPage><MensagensPage /></AppPage> },
  { path: 'mensagens/:conversationId', element: <AppPage><MensagemDetailPage /></AppPage> },
  { path: 'login', element: <AuthPage><LoginPage /></AuthPage> },
  { path: 'register', element: <AuthPage><RegisterPage /></AuthPage> },
  { path: 'forgot-password', element: <AuthPage><ForgotPasswordPage /></AuthPage> },
  { path: 'reset-password', element: <AuthPage><ResetPasswordPage /></AuthPage> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
