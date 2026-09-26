import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { useTutorials } from '@/api/tutorials/queries'
import { Clock3, Eye, MonitorPlay, Search, User } from 'lucide-react'

function formatDuration(duration: number | string | null | undefined): string | null {
  if (duration == null || duration === '') return null
  if (typeof duration === 'string') return duration
  if (duration <= 0) return null
  // Heurística: >= 1000 provavelmente está em segundos.
  const totalSeconds = duration >= 1000 ? Math.round(duration) : Math.round(duration * 60)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  if (mins <= 0) return `${secs}s`
  return secs > 0 ? `${mins}min ${secs}s` : `${mins}min`
}

export default function TutoriaisPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useTutorials({ page, limit: 12, q: search || undefined })

  if (isLoading) return <LoadingScreen />

  if (isError) {
    return (
      <div className="hx-page">
        <PageHeader title="Tutoriais" description="Aprenda a usar a plataforma" />
        <EmptyState
          title="Erro ao carregar tutoriais"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      </div>
    )
  }

  const tutorials = data?.data ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages ?? 0
  const currentPage = pagination?.page ?? page

  return (
    <div className="hx-page">
      <PageHeader
        title="Tutoriais"
        description="Aprenda a usar a plataforma"
      />

      <Card className="mb-6 p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar tutorial..."
            className="hx-input w-full pl-10"
          />
        </div>
      </Card>

      <p className="mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{pagination?.total ?? tutorials.length}</span> tutoriais encontrados
      </p>

      {tutorials.length === 0 ? (
        <EmptyState
          icon={<MonitorPlay className="h-12 w-12" aria-hidden="true" />}
          title="Nenhum tutorial encontrado"
          description={search ? 'Tente ajustar a busca.' : 'Novos tutoriais serão publicados em breve.'}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial) => {
              const routeId = tutorial.slug ?? tutorial.id
              const durationLabel = formatDuration(tutorial.duration ?? null)
              return (
                <Link
                  key={tutorial.id}
                  to={`/tutoriais/${routeId}`}
                  className="group block overflow-hidden rounded-xl border border-border bg-surface transition hover:border-teal-400/35 hover:bg-surface-strong"
                >
                  {tutorial.thumbnailUrl ? (
                    <img
                      src={tutorial.thumbnailUrl}
                      alt={tutorial.title}
                      loading="lazy"
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-teal-900/50 to-cyan-900/30">
                      <MonitorPlay className="h-10 w-10 text-teal-400/50" />
                    </div>
                  )}
                  <div className="p-5">
                    {(tutorial.categoryName ?? null) && (
                      <div className="mb-3">
                        <Badge variant="teal">{tutorial.categoryName}</Badge>
                      </div>
                    )}

                    <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-teal-200">
                      {tutorial.title}
                    </h3>
                    {(tutorial.description ?? null) && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {tutorial.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                      {durationLabel && (
                        <span className="flex items-center gap-1.5">
                          <Clock3 className="h-4 w-4 text-sky-300" />
                          {durationLabel}
                        </span>
                      )}
                      {tutorial.viewCount != null && (
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4 text-teal-300" />
                          {tutorial.viewCount} visualizações
                        </span>
                      )}
                      {(tutorial.authorName ?? null) && (
                        <span className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {tutorial.authorName}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
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
