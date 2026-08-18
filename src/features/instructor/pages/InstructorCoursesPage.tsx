import { useNavigate } from 'react-router-dom'
import { useInstructorStatus, useInstructorMyCourses } from '@/api/instructor/queries'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  APPLICATION_STATUS_LABELS,
  COURSE_STATUS_LABELS,
  COURSE_LEVEL_LABELS,
} from '@/domain/types/instructor.types'

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' | 'emerald' {
  if (status === 'APPROVED') return 'emerald'
  if (status === 'PENDING_REVIEW') return 'outline'
  return 'secondary'
}

export default function InstructorCoursesPage() {
  const navigate = useNavigate()
  const { data: status, isLoading: statusLoading } = useInstructorStatus()
  const { data: courses, isLoading: coursesLoading } = useInstructorMyCourses()

  if (statusLoading) return <LoadingScreen />

  const isApproved = status?.application?.status === 'APPROVED'

  if (!isApproved) {
    return (
      <div className="hx-page">
        <PageHeader
          title="Área do instrutor"
          description="Para criar cursos na Hexavante, você precisa ser aprovado como instrutor."
        />
        {status?.application?.status === 'PENDING' ? (
          <div className="hx-card p-4">
            <Badge variant="secondary">
              {APPLICATION_STATUS_LABELS.PENDING}
            </Badge>
            <p className="mt-2 text-sm text-slate-400">
              Solicitação em análise pelo moderador.
            </p>
          </div>
        ) : (
          <>
            <EmptyState
              icon={<span className="text-5xl">🎓</span>}
              title="Você ainda não é instrutor"
              description="Solicite acesso para criar cursos na plataforma."
              action={{ label: 'Solicitar perfil de instrutor', onClick: () => navigate('/instrutor/solicitar') }}
            />
          </>
        )}
      </div>
    )
  }

  if (coursesLoading) return <LoadingScreen />

  return (
    <div className="hx-page">
      <PageHeader
        title="Meus cursos"
        description="Cursos novos ficam pendentes até aprovação de um moderador."
        action={
          <Button size="sm" onClick={() => navigate('/instrutor/cursos/novo')}>
            Novo curso
          </Button>
        }
      />

      {!courses || courses.length === 0 ? (
        <EmptyState
          icon={<span className="text-5xl">📚</span>}
          title="Você ainda não criou nenhum curso"
          description="Comece criando seu primeiro curso."
          action={{ label: 'Criar primeiro curso', onClick: () => navigate('/instrutor/cursos/novo') }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="hx-card overflow-hidden">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white">{course.title}</h3>
                  <Badge variant={statusBadgeVariant(course.status)}>
                    {COURSE_STATUS_LABELS[course.status] ?? course.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {COURSE_LEVEL_LABELS[course.level] ?? course.level}
                  {course.categoryName ? ` · ${course.categoryName}` : ''}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>{course.moduleCount} módulos</span>
                  <span>{course.enrollmentCount} matrículas</span>
                  {course.estimatedHours && <span>~{course.estimatedHours}h</span>}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/cursos/${course.id}`)}
                >
                  Gerenciar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}