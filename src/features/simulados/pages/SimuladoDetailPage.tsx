import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { useExamDetail } from '@/api/exams/queries'
import { useStartAttempt } from '@/api/exams/queries'
import { useAuth } from '@/app/hooks/use-auth'
import { Clock3, ClipboardList, Crown, Play, ArrowLeft, Shield } from 'lucide-react'

const EXAM_TYPE_LABELS: Record<string, string> = {
  ENEM: 'ENEM',
  VESTIBULAR: 'Vestibular',
  TECNOLOGIA: 'Tecnologia',
}

const EXAM_BADGE_VARIANTS: Record<string, 'blue' | 'violet' | 'teal'> = {
  ENEM: 'blue',
  VESTIBULAR: 'violet',
  TECNOLOGIA: 'teal',
}

export default function SimuladoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: exam, isLoading, error } = useExamDetail(slug || '')
  const startAttempt = useStartAttempt()

  const handleStart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const result = await startAttempt.mutateAsync(slug!)
      navigate(`/simulados/${slug}/fazer/${result.attemptId}`)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (isLoading) return <LoadingScreen />

  if (error || !exam) {
    return (
      <div className="hx-page max-w-3xl mx-auto text-center">
        <PageHeader title="Simulado não encontrado" />
        <Card>
          <div className="p-8">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground mb-2">Simulado não encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">Este simulado não existe ou foi removido</p>
            <Button variant="outline" onClick={() => navigate('/simulados')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const canStart = exam.questions.length > 0
  const isPremiumLocked = exam.isPremiumOnly && !user?.isPremium

  return (
    <div className="hx-page max-w-3xl mx-auto">
      <PageHeader
        title={exam.title}
        description={exam.description || undefined}
      >
        <Link to="/simulados" className="hx-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </PageHeader>

      <Card className="mb-6">
        <div className="aspect-video relative overflow-hidden rounded-t-xl">
          {exam.coverImage ? (
            <img src={exam.coverImage} alt={exam.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-900/50 to-slate-900">
              <ClipboardList className="h-16 w-16 text-teal-400/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={EXAM_BADGE_VARIANTS[exam.examType] ?? 'default'}>
                <Shield className="h-3.5 w-3.5" />
                {EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}
              </Badge>
              {exam.isPremiumOnly && (
                <Badge variant="violet">
                  <Crown className="h-3.5 w-3.5" />
                  Premium
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{exam.title}</h1>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {exam.description && (
            <p className="text-muted-foreground leading-relaxed">{exam.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-teal-300" />
              {exam.questionCount} questões
            </span>
            {exam.timeLimit && (
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-sky-300" />
                {exam.timeLimit} min
              </span>
            )}
            {exam.isPremiumOnly && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Crown className="h-4 w-4" />
                Exclusivo Premium
              </span>
            )}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pronto para testar seus conhecimentos?</p>
              <p className="text-xs text-muted-foreground">
                {exam.questionCount} questões {exam.timeLimit ? `em ${exam.timeLimit} min` : 'sem limite de tempo'}
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleStart}
              disabled={startAttempt.isPending || !canStart || isPremiumLocked}
              className="w-full sm:w-auto"
            >
              {startAttempt.isPending ? (
                'Iniciando...'
              ) : isPremiumLocked ? (
                <>
                  <Crown className="h-4 w-4 mr-2" /> Requer Premium
                </>
              ) : !canStart ? (
                'Sem questões disponíveis'
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Iniciar Simulado
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">Sobre este simulado</h3>
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-2xl font-bold text-teal-400">{exam.questionCount}</p>
              <p className="text-xs text-muted-foreground">Questões</p>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-2xl font-bold text-sky-400">{exam.timeLimit ?? '∞'}</p>
              <p className="text-xs text-muted-foreground">Minutos</p>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-2xl font-bold text-amber-400">{EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}</p>
              <p className="text-xs text-muted-foreground">Tipo</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}