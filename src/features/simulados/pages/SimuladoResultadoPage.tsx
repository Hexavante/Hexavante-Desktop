import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import type { AttemptResult } from '@/domain/types/exam.types'
import { CheckCircle, XCircle, Clock3, ClipboardList, ArrowLeft, TrendingUp, Target, Zap, Coins, RotateCcw } from 'lucide-react'

interface LocationState {
  result?: AttemptResult
  examTitle?: string
  examSlug?: string
}

export default function SimuladoResultadoPage() {
  const { slug, attemptId } = useParams<{ slug: string; attemptId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as LocationState | null

  // O resultado vem do submit via router state — não há endpoint de resultado.
  const result = locationState?.result ?? null
  const examTitle = locationState?.examTitle ?? result?.examTitle
  const examSlug = locationState?.examSlug ?? result?.examSlug ?? slug

  if (!result) {
    return (
      <div className="hx-page max-w-3xl mx-auto text-center">
        <PageHeader title="Resultado expirado" />
        <EmptyState
          icon={<ClipboardList className="h-10 w-10 text-muted-foreground" />}
          title="Resultado expirado, refaça o simulado"
          description="O resultado não está mais disponível nesta sessão (a página foi recarregada ou acessada por link direto)."
          action={{ label: 'Refazer simulado', onClick: () => navigate(`/simulados/${slug}`) }}
        />
        <div className="mt-4 flex gap-2 justify-center">
          <Button variant="outline" onClick={() => navigate('/simulados')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar aos Simulados
          </Button>
          <Button variant="outline" onClick={() => navigate('/simulados/historico')}>
            <TrendingUp className="h-4 w-4 mr-2" /> Ver Histórico
          </Button>
        </div>
      </div>
    )
  }

  const percentage = result.percentage ?? (result.totalQuestions > 0
    ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
    : 0)

  const xpReward = result.xpAwarded ?? 0
  const coinsReward = result.coinsAwarded ?? 0

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-500/20 border-green-500/30'
    if (score >= 50) return 'bg-amber-500/20 border-amber-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  return (
    <div className="hx-page max-w-4xl mx-auto">
      <PageHeader
        title="Resultado do Simulado"
        description={examTitle}
      >
        <Link to={`/simulados/${examSlug}`} className="hx-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Simulado
        </Link>
      </PageHeader>

      {/* Score Summary */}
      <Card className="mb-6">
        <div className="p-6 text-center">
          <div className="mb-4">
            <span className={`text-5xl font-black ${getScoreColor(percentage)}`}>
              {percentage}%
            </span>
            <span className="ml-2 text-muted-foreground">de 100%</span>
          </div>
          <div className="h-4 w-full max-w-md mx-auto bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${getScoreBg(percentage)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span>{result.correctAnswers} corretas</span>
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="h-4 w-4" />
              <span>{result.totalQuestions - result.correctAnswers} incorretas</span>
            </div>
            {result.finishedAt && (
              <div className="flex items-center gap-2 text-sky-400">
                <Clock3 className="h-4 w-4" />
                <span>{new Date(result.finishedAt).toLocaleString('pt-BR')}</span>
              </div>
            )}
          </div>
          {(xpReward > 0 || coinsReward > 0) && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {xpReward > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-4 w-4 text-amber-400" />
                  +{xpReward} XP
                </span>
              )}
              {xpReward > 0 && coinsReward > 0 && <span aria-hidden="true">·</span>}
              {coinsReward > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Coins className="h-4 w-4 text-amber-400" />
                  +{coinsReward} moedas
                </span>
              )}
            </div>
          )}
          {attemptId && (
            <p className="mt-3 text-xs text-muted-foreground">Tentativa {attemptId}</p>
          )}
        </div>
      </Card>

      {/* Exam Info */}
      <div className="grid gap-4 mb-6 sm:grid-cols-3">
        <Card className="p-4 text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-teal-400" />
          <p className="text-2xl font-bold text-foreground">{percentage}%</p>
          <p className="text-xs text-muted-foreground">Pontuação Final</p>
        </Card>
        <Card className="p-4 text-center">
          <Target className="h-8 w-8 mx-auto mb-2 text-amber-400" />
          <p className="text-2xl font-bold text-foreground">{result.correctAnswers}/{result.totalQuestions}</p>
          <p className="text-xs text-muted-foreground">Questões Certas</p>
        </Card>
        <Card className="p-4 text-center">
          <ClipboardList className="h-8 w-8 mx-auto mb-2 text-sky-400" />
          <p className="text-2xl font-bold text-foreground">{result.score}%</p>
          <p className="text-xs text-muted-foreground">Aproveitamento</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate(`/simulados/${examSlug}`)}>
          <RotateCcw className="h-4 w-4 mr-2" /> Tentar Novamente
        </Button>
        <Button onClick={() => navigate('/simulados/historico')}>
          <TrendingUp className="h-4 w-4 mr-2" /> Ver Histórico
        </Button>
        <Button variant="outline" onClick={() => navigate('/simulados')}>
          <ClipboardList className="h-4 w-4 mr-2" /> Outros Simulados
        </Button>
      </div>
    </div>
  )
}
