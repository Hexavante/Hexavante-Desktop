import { useParams, useNavigate } from 'react-router-dom'
import { useCourse, useCourseProgress } from '@/api/courses/queries'
import { useEnrollCourse } from '@/api/courses/mutations'
import { useAuth } from '@/app/hooks/use-auth'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClipboardList, CheckCircle2 } from 'lucide-react'
import type { LessonDto } from '@/domain/types/course.types'

function ModuleItem({ title, description, orderNumber, lessons, onLessonClick }: {
  title: string
  description: string | null
  orderNumber: number
  lessons: LessonDto[]
  onLessonClick: (lesson: LessonDto) => void
}) {
  return (
    <div className="hx-card p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-400">
          {orderNumber}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-foreground">{title}</h4>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          <div className="mt-3 space-y-1">
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-surface px-3 py-2 transition hover:bg-surface"
                onClick={() => onLessonClick(lesson)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onLessonClick(lesson)}
              >
                <span className="text-xs text-muted-foreground">{String(orderNumber).padStart(2, '0')}.{String(idx + 1).padStart(2, '0')}</span>
                <span className="flex-1 truncate text-sm text-muted-foreground">{lesson.title}</span>
                {lesson.duration && (
                  <span className="shrink-0 text-xs text-muted-foreground">{Math.floor(lesson.duration / 60)}min</span>
                )}
                <span className="text-xs text-cyan-400">▶</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CursoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const { data: course, isLoading, isError } = useCourse(id!)
  const { data: progress } = useCourseProgress(id!)
  const enrollMutation = useEnrollCourse()

  if (isLoading) return <LoadingScreen />
  if (isError || !course) {
    return (
      <div className="hx-page">
        <PageHeader title="Curso não encontrado" />
        <EmptyState
          title="Curso não encontrado"
          description="O curso que você procura não existe ou foi removido"
          action={{ label: 'Ver cursos', onClick: () => navigate('/cursos') }}
        />
      </div>
    )
  }

  const isEnrolled = !!progress

  return (
    <div className="hx-page">
      <PageHeader title={course.title} description={course.shortDescription || undefined}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/cursos')}>
          ← Voltar
        </Button>
      </PageHeader>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="outline">
              {course.level === 'BEGINNER' ? 'Iniciante' : course.level === 'INTERMEDIATE' ? 'Intermediário' : 'Avançado'}
            </Badge>
            <Badge variant="secondary">
              {course.courseType === 'FREE' ? 'Gratuito' : course.courseType === 'PAID' ? 'Pago' : 'Premium'}
            </Badge>
            {course.totalModules > 0 && <Badge variant="outline">{course.totalModules} módulos</Badge>}
            {course.totalLessons > 0 && <Badge variant="outline">{course.totalLessons} aulas</Badge>}
            {course.estimatedHours && <Badge variant="outline">~{course.estimatedHours}h</Badge>}
          </div>

          {course.description && (
            <div className="hx-card mb-4 p-4">
              <h3 className="mb-2 text-sm font-bold text-foreground">Sobre o curso</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
            </div>
          )}

          {isEnrolled && progress && (
            <div className="hx-card mb-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Seu Progresso</h3>
                <span className="text-sm font-bold text-cyan-400">{Math.round(progress.progress)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="hx-card p-4">
            <h3 className="mb-3 text-sm font-bold text-foreground">Ações</h3>
            {isEnrolled ? (
              <Button className="w-full" disabled>
                <CheckCircle2 className="h-4 w-4" />
                Matriculado
              </Button>
            ) : (
              <Button
                className="w-full"
                disabled={!isAuthenticated || enrollMutation.isPending}
                onClick={() => enrollMutation.mutate(id!, {
                  onSuccess: () => navigate(`/cursos/${id}`),
                })}
              >
                {enrollMutation.isPending ? 'Matriculando...' : (
                  <>
                    <ClipboardList className="h-4 w-4" />
                    Matricular-se
                  </>
                )}
              </Button>
            )}
            {!isAuthenticated && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Faça login para se matricular
              </p>
            )}
          </div>

          {isEnrolled && progress?.modules && (
            <div className="hx-card mt-4 p-4">
              <h3 className="mb-3 text-sm font-bold text-foreground">Progresso por Módulo</h3>
              <div className="space-y-2">
                {progress.modules.map(m => (
                  <div key={m.moduleId} className="flex items-center justify-between text-sm">
                    <span className="truncate text-muted-foreground">{m.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {m.completedLessons}/{m.totalLessons}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <h3 className="mb-4 text-lg font-bold text-foreground">Conteúdo do Curso</h3>
      <div className="space-y-3">
        {course.modules.map(m => (
          <ModuleItem
            key={m.id}
            title={m.title}
            description={m.description}
            orderNumber={m.orderNumber}
            lessons={m.lessons}
            onLessonClick={(lesson) => navigate(`/cursos/${id}/learn/${lesson.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
