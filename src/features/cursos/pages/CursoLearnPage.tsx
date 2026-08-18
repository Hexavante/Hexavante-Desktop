import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourse, useCourseProgress } from '@/api/courses/queries'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'

export default function CursoLearnPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: course, isLoading, isError } = useCourse(id!)
  const { data: progress } = useCourseProgress(id!)

  useEffect(() => {
    if (!course || !progress) return

    const allLessons = course.modules.flatMap((m) => m.lessons)
    if (allLessons.length === 0) return

    const firstIncomplete =
      progress.modules.flatMap((m) => m.lessons).find((l) => !l.completed) ??
      progress.modules.flatMap((m) => m.lessons)[0]

    navigate(`/cursos/${id}/learn/${firstIncomplete.lessonId}`, { replace: true })
  }, [course, progress, id, navigate])

  if (isLoading) return <LoadingScreen />
  if (isError || !course) {
    return (
      <EmptyState
        title="Curso não encontrado"
        description="O curso que você procura não existe ou foi removido"
        action={{ label: 'Ver cursos', onClick: () => navigate('/cursos') }}
      />
    )
  }

  const allLessons = course.modules.flatMap((m) => m.lessons)

  if (allLessons.length === 0) {
    return (
      <EmptyState
        title="Nenhuma aula disponível"
        description="Este curso ainda não possui aulas"
        action={{ label: 'Voltar ao curso', onClick: () => navigate(`/cursos/${id}`) }}
      />
    )
  }

  return (
    <div className="hx-page flex items-center justify-center">
      <Button onClick={() => navigate(`/cursos/${id}`)}>Voltar ao curso</Button>
    </div>
  )
}