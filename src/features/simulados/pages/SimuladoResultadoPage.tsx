import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { useAttemptResult } from '@/api/exams/queries'
import { Trophy, CheckCircle, XCircle, Clock3, ClipboardList, ArrowLeft, TrendingUp, Target } from 'lucide-react'

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

export default function SimuladoResultadoPage() {
  const { slug, attemptId } = useParams<{ slug: string; attemptId: string }>()
  const navigate = useNavigate()
  const { data: result, isLoading, error } = useAttemptResult(slug || '', attemptId || '')

  if (isLoading) return <LoadingScreen />

  if (error || !result) {
    return (
      <div className="hx-page max-w-3xl mx-auto text-center">
        <PageHeader title="Resultado não encontrado" />
        <Card>
          <div className="p-8">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground mb-2">Resultado não encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">Esta tentativa não existe ou foi removida</p>
            <Button variant="outline" onClick={() => navigate('/simulados')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar aos Simulados
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const percentage = result.totalQuestions > 0
    ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
    : 0

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
        description={result.examTitle}
      >
        <Link to={`/simulados/${slug}`} className="hx-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Simulado
        </Link>
      </PageHeader>

      {/* Score Summary */}
      <Card className="mb-6">
        <div className="p-6 text-center">
          <div className="mb-4">
            <span className={`text-5xl font-black ${getScoreColor(result.score)}`}>
              {result.score}%
            </span>
            <span className="ml-2 text-muted-foreground">de 100%</span>
          </div>
          <div className="h-4 w-full max-w-md mx-auto bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${getScoreBg(result.score)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-4 flex justify-center gap-8 text-sm">
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
        </div>
      </Card>

      {/* Exam Info */}
      <div className="grid gap-4 mb-6 sm:grid-cols-3">
        <Card className="p-4 text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-teal-400" />
          <p className="text-2xl font-bold text-foreground">{result.score}%</p>
          <p className="text-xs text-muted-foreground">Pontuação Final</p>
        </Card>
        <Card className="p-4 text-center">
          <Target className="h-8 w-8 mx-auto mb-2 text-amber-400" />
          <p className="text-2xl font-bold text-foreground">{result.correctAnswers}/{result.totalQuestions}</p>
          <p className="text-xs text-muted-foreground">Questões Certas</p>
        </Card>
        <Card className="p-4 text-center">
          <ClipboardList className="h-8 w-8 mx-auto mb-2 text-sky-400" />
          <p className="text-2xl font-bold text-foreground">{percentage}%</p>
          <p className="text-xs text-muted-foreground">Aproveitamento</p>
        </Card>
      </div>

      {/* Question Details */}
      <Card>
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Detalhamento das Questões</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                {result.correctAnswers} Certas
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <XCircle className="h-3 w-3 mr-1 text-red-400" />
                {result.totalQuestions - result.correctAnswers} Erradas
              </Badge>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {result.questionResults.map((qr, index) => {
              const isCorrect = qr.isCorrect
              return (
                <div
                  key={qr.questionId}
                  className={`p-4 rounded-lg border transition ${
                    isCorrect
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Questão {index + 1}
                        </span>
                        <span className={`text-xs font-semibold ${
                          isCorrect ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {isCorrect ? 'Correta' : 'Incorreta'}
                        </span>
                        <span className="text-xs text-muted-foreground">{qr.points} pts</span>
                        {qr.earnedPoints !== qr.points && (
                          <span className="text-xs text-amber-400">
                            {qr.earnedPoints}/{qr.points} pts
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{qr.questionStatement}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-400" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {qr.alternatives.map((alt) => {
                      const isUserAnswer = qr.userAnswer === alt.id
                      const isCorrectAnswer = alt.isCorrect
                      let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'outline'

                      if (isUserAnswer && isCorrectAnswer) variant = 'default'
                      else if (isUserAnswer && !isCorrectAnswer) variant = 'destructive'
                      else if (isCorrectAnswer) variant = 'secondary'

                      return (
                        <Badge
                          key={alt.id}
                          variant={variant}
                          className="w-full justify-start gap-2 text-xs"
                        >
                          {isUserAnswer && <span className="text-amber-400">👈 Sua resposta</span>}
                          {isCorrectAnswer && <span className="text-green-400">✓ Correta</span>}
                          {alt.text}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate(`/simulados/${slug}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Tentar Novamente
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