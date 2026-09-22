import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourses } from '@/api/courses/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, RotateCcw } from 'lucide-react'
import type { CourseLevel, CourseType } from '@/domain/types/course.types'

const LEVELS = [
  { value: '', label: 'Todos' },
  { value: 'BEGINNER', label: 'Iniciante' },
  { value: 'INTERMEDIATE', label: 'Intermediário' },
  { value: 'ADVANCED', label: 'Avançado' },
] as const

const TYPES = [
  { value: '', label: 'Todos' },
  { value: 'FREE', label: 'Gratuito' },
  { value: 'PAID', label: 'Pago' },
  { value: 'PREMIUM', label: 'Premium' },
] as const

export default function CursosListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<CourseLevel | ''>('')
  const [courseType, setCourseType] = useState<CourseType | ''>('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, refetch } = useCourses({
    page,
    limit: 12,
    level: level || undefined,
    courseType: courseType || undefined,
    search: search || undefined,
  })

  const hasActiveFilters = search !== '' || level !== '' || courseType !== ''

  function handleClearFilters() {
    setSearch('')
    setLevel('')
    setCourseType('')
    setPage(1)
    refetch()
  }

  return (
    <div className="hx-page">
      <PageHeader title="Cursos" description="Explore todos os cursos disponíveis">
        <Button variant="outline" size="sm" onClick={handleClearFilters} disabled={!hasActiveFilters}>
          <RotateCcw className="h-4 w-4" />
          Limpar filtros
        </Button>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="navbar-search flex-1">
          <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            placeholder="Buscar cursos..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select
          className="hx-input w-auto"
          value={level}
          onChange={e => { setLevel(e.target.value as CourseLevel | ''); setPage(1) }}
        >
          {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <select
          className="hx-input w-auto"
          value={courseType}
          onChange={e => { setCourseType(e.target.value as CourseType | ''); setPage(1) }}
        >
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <EmptyState
          title="Erro ao carregar cursos"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="Nenhum curso encontrado"
          description="Tente ajustar os filtros ou buscar por outro termo"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map(course => (
              <div
                key={course.id}
                className="hx-card-interactive group cursor-pointer overflow-hidden"
                onClick={() => navigate(`/cursos/${course.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/cursos/${course.id}`)}
              >
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                  <BookOpen className="h-12 w-12" />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{course.level === 'BEGINNER' ? 'Iniciante' : course.level === 'INTERMEDIATE' ? 'Intermediário' : 'Avançado'}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{course.courseType === 'FREE' ? 'Grátis' : course.courseType === 'PAID' ? 'Pago' : 'Premium'}</Badge>
                  </div>
                  <h3 className="truncate text-sm font-bold text-foreground group-hover:text-cyan-400">{course.title}</h3>
                  {course.shortDescription && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{course.shortDescription}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{course.totalModules} módulos</span>
                    <span>{course.totalLessons} aulas</span>
                    {course.estimatedHours && <span>~{course.estimatedHours}h</span>}
                  </div>
                  {course.instructorName && (
                    <p className="mt-2 text-xs text-muted-foreground">Por {course.instructorName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {data.pagination.page} de {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
