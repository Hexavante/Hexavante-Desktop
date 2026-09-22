import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useLesson,
  useCourseProgress,
  useLessonNote,
} from '@/api/courses/queries'
import {
  useCompleteLesson,
  useToggleLessonFavorite,
  useSaveLessonNote,
} from '@/api/courses/mutations'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clapperboard, FileText } from 'lucide-react'

function VideoPlayer({ url, provider }: { url: string; provider: string | null }) {
  if (provider === 'VIMEO' || provider === 'YOUTUBE') {
    return (
      <div className="aspect-video overflow-hidden rounded-lg">
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
          <span className="text-sm text-muted-foreground">Player de vídeo ({provider})</span>
        </div>
        <p className="mt-2 truncate text-xs text-muted-foreground">{url}</p>
      </div>
    )
  }
  return (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
      <Clapperboard className="h-12 w-12" />
    </div>
  )
}

export default function LessonLearnPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const navigate = useNavigate()
  const [noteDraft, setNoteDraft] = useState('')

  const { data, isLoading, isError } = useLesson(id!, lessonId!)
  const { data: progress } = useCourseProgress(id!)
  const { data: note } = useLessonNote(id!, lessonId!)
  const completeMutation = useCompleteLesson(id!)
  const favoriteMutation = useToggleLessonFavorite(id!)
  const saveMutation = useSaveLessonNote(id!, lessonId!)

  if (isLoading) return <LoadingScreen />
  if (isError || !data) {
    return (
      <div className="hx-page">
        <Card className="p-5">
          <p className="rounded-lg bg-amber-900/20 p-4 text-amber-400">
            Não foi possível carregar a aula. Verifique sua matrícula ou volte ao curso.
          </p>
          <Button className="mt-4" onClick={() => navigate(`/cursos/${id}`)}>
            Voltar ao curso
          </Button>
        </Card>
      </div>
    )
  }

  const { course, lesson, module, sidebarLessons, learning } = data
  const overallProgress = progress?.progress ?? data.enrollment.progress

  const handleComplete = () => {
    completeMutation.mutate(lessonId!, {
      onSuccess: () => {
        if (learning.nextLesson && learning.nextLesson.id !== lesson.id) {
          navigate(`/cursos/${id}/learn/${learning.nextLesson.id}`)
        } else {
          navigate(`/cursos/${id}`)
        }
      },
    })
  }

  const handleFavorite = () => {
    favoriteMutation.mutate(lesson.id)
  }

  const handleSaveNote = () => {
    saveMutation.mutate(noteDraft)
  }

  return (
    <div className="hx-page">
      <PageHeader
        title={course.title}
        description={`Aula ${learning.currentLessonNumber} de ${learning.totalLessons}`}
      >
        <Button variant="ghost" size="sm" onClick={() => navigate(`/cursos/${id}`)}>
          ← Voltar ao curso
        </Button>
        <Button
          variant={learning.isFavorite ? 'default' : 'outline'}
          size="sm"
          onClick={handleFavorite}
        >
          {learning.isFavorite ? '★ Favorita' : '☆ Favoritar'}
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline">{learning.remainingLabel} restantes</Badge>
        <Badge variant="secondary">{learning.completedLessons} aulas concluídas</Badge>
        <Badge variant="outline">Progresso {Math.round(overallProgress)}%</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hx-card p-3">
          <div className="mb-2 px-2 text-sm font-bold text-foreground">Conteúdo</div>
          <div className="space-y-1">
            {sidebarLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => navigate(`/cursos/${id}/learn/${l.id}`)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                  l.id === lesson.id
                    ? 'bg-cyan-500/15 text-cyan-300'
                    : 'text-muted-foreground hover:bg-surface'
                }`}
              >
                <span className="shrink-0 text-xs text-muted-foreground">
                  {String(l.moduleOrder).padStart(2, '0')}.
                  {String(l.orderNumber).padStart(2, '0')}
                </span>
                <span className="flex-1 truncate">{l.title}</span>
                {l.isCompleted && <span className="shrink-0 text-emerald-400">✓</span>}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          {module && (
            <p className="text-sm text-muted-foreground">
              Módulo {module.orderNumber}: {module.title}
            </p>
          )}

          <div>
            <h2 className="text-2xl font-bold text-foreground">{lesson.title}</h2>
            {lesson.description && <p className="mt-2 text-muted-foreground">{lesson.description}</p>}
          </div>

          {lesson.videoUrl && (
            <VideoPlayer url={lesson.videoUrl} provider={lesson.videoProvider} />
          )}

          {module && module.materials.length > 0 && (
            <div className="hx-card p-4">
              <h3 className="mb-3 text-sm font-bold text-foreground">Material do módulo</h3>
              <div className="space-y-2">
                {module.materials.map((m) => (
                  <a
                    key={m.id}
                    href={m.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm text-cyan-400 hover:bg-surface"
                  >
                    <FileText className="h-4 w-4 shrink-0" /> {m.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="hx-card p-4">
            <h3 className="mb-3 text-sm font-bold text-foreground">Anotações</h3>
            <textarea
              className="min-h-28 w-full rounded-md border border-border bg-surface p-3 text-sm text-foreground"
              placeholder="Escreva suas anotações desta aula..."
              defaultValue={note ?? ''}
              onChange={(e) => setNoteDraft(e.target.value)}
            />
            <Button
              className="mt-2"
              size="sm"
              disabled={saveMutation.isPending}
              onClick={handleSaveNote}
            >
              {saveMutation.isPending ? 'Salvando...' : 'Salvar nota'}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              disabled={completeMutation.isPending || lesson.isCompleted}
              onClick={handleComplete}
            >
              {lesson.isCompleted
                ? '✓ Aula concluída'
                : completeMutation.isPending
                  ? 'Concluindo...'
                  : 'Concluir aula'}
            </Button>
            {lesson.isCompleted && learning.nextLesson && (
              <Button
                variant="outline"
                onClick={() => navigate(`/cursos/${id}/learn/${learning.nextLesson!.id}`)}
              >
                Próxima aula →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}