import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { useTutorial } from '@/api/tutorials/queries'
import { tutorialService } from '@/services/tutorial.service'
import { Clock3, Eye, MonitorPlay, User } from 'lucide-react'

function formatDuration(duration: number | string | null | undefined): string | null {
  if (duration == null || duration === '') return null
  if (typeof duration === 'string') return duration
  if (duration <= 0) return null
  const totalSeconds = duration >= 1000 ? Math.round(duration) : Math.round(duration * 60)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  if (mins <= 0) return `${secs}s`
  return secs > 0 ? `${mins}min ${secs}s` : `${mins}min`
}

export default function TutorialDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: tutorial, isLoading, isError, refetch } = useTutorial(id ?? '')

  // Fire-and-forget: registra a visualização uma vez por montagem.
  useEffect(() => {
    if (id) {
      tutorialService.registerView(id)
    }
  }, [id])

  if (isLoading) return <LoadingScreen />

  if (isError || !tutorial) {
    return (
      <div className="hx-page">
        <PageHeader title="Tutorial não encontrado" />
        <EmptyState
          icon={<MonitorPlay className="h-12 w-12" aria-hidden="true" />}
          title="Tutorial não encontrado"
          description="O tutorial que você procura não existe ou foi removido."
          action={{ label: 'Ver tutoriais', onClick: () => navigate('/tutoriais') }}
        />
      </div>
    )
  }

  const videoUrl = tutorial.videoUrl ?? null
  const durationLabel = formatDuration(tutorial.duration ?? null)

  return (
    <div className="hx-page">
      <PageHeader title={tutorial.title} description={tutorial.description ?? undefined}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/tutoriais')}>
          ← Voltar
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        {(tutorial.categoryName ?? null) && (
          <Badge variant="teal">{tutorial.categoryName}</Badge>
        )}
        {durationLabel && (
          <Badge variant="outline">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {durationLabel}
          </Badge>
        )}
        {tutorial.viewCount != null && (
          <Badge variant="outline">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {tutorial.viewCount} visualizações
          </Badge>
        )}
        {(tutorial.authorName ?? null) && (
          <Badge variant="outline">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            {tutorial.authorName}
          </Badge>
        )}
      </div>

      <div className="hx-card overflow-hidden">
        {videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            preload="metadata"
            poster={tutorial.thumbnailUrl ?? undefined}
            className="aspect-video w-full bg-surface"
          />
        ) : (tutorial.thumbnailUrl ?? null) ? (
          <img
            src={tutorial.thumbnailUrl as string}
            alt={tutorial.title}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-teal-900/50 to-cyan-900/30">
            <MonitorPlay className="h-14 w-14 text-teal-400/50" aria-hidden="true" />
          </div>
        )}
      </div>

      {(tutorial.description ?? null) && (
        <div className="hx-card mt-4 p-5">
          <h3 className="mb-2 text-sm font-bold text-foreground">Sobre este tutorial</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tutorial.description}
          </p>
        </div>
      )}

      {(tutorial.content ?? null) && (
        <div className="hx-card mt-4 p-5">
          <h3 className="mb-2 text-sm font-bold text-foreground">Conteúdo</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {tutorial.content}
          </p>
        </div>
      )}

      {!videoUrl && (
        <div className="mt-4">
          <EmptyState
            title="Vídeo indisponível"
            description="Este tutorial ainda não possui vídeo. Tente novamente mais tarde."
            action={{ label: 'Tentar novamente', onClick: () => refetch() }}
          />
        </div>
      )}
    </div>
  )
}
