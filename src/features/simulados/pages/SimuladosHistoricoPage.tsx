import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { useExamHistory, useExamStats, useExamEvolution, useExamSubjectStats } from '@/api/exams/queries'

const EXAM_PASS_SCORE = 60

export default function SimuladosHistoricoPage() {
  const [searchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const { data: history, isLoading: historyLoading, isError: historyError } = useExamHistory({ page })
  const { data: stats, isLoading: statsLoading, isError: statsError } = useExamStats()
  const { data: evolution } = useExamEvolution()
  const { data: subjectStats } = useExamSubjectStats()

  if (historyLoading || statsLoading) return <LoadingScreen />

  if (historyError || statsError) {
    return (
      <div className="hx-page">
        <PageHeader
          title="Meu histórico"
          description="Acompanhe tentativas, médias e evolução nos simulados."
        />
        <Card>
          <p className="text-sm text-muted-foreground">Não foi possível carregar o histórico.</p>
          <button type="button" className="hx-btn hx-btn-primary mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="hx-page">
      <PageHeader
        title="Meu histórico"
        description="Acompanhe tentativas, médias e evolução nos simulados."
      />

      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card >
            <p className="text-sm text-muted-foreground">Tentativas</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalAttempts}</p>
          </Card>
          <Card >
            <p className="text-sm text-muted-foreground">Média</p>
            <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
          </Card>
          <Card >
            <p className="text-sm text-muted-foreground">Melhor nota</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.bestScore}%</p>
          </Card>
        </div>
      )}

      {evolution && evolution.length > 0 && (
        <Card  className="mb-6">
          <h3 className="mb-3 text-sm font-bold text-foreground">Evolução</h3>
          <div className="flex items-end gap-2">
            {evolution.map((point, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-teal-500/30"
                  style={{ height: `${point.score}px`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {new Date(point.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {subjectStats && subjectStats.length > 0 && (
        <Card  className="mb-6">
          <h3 className="mb-3 text-sm font-bold text-foreground">Desempenho por assunto</h3>
          <div className="space-y-3">
            {subjectStats.map((s) => (
              <div key={s.subject}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.subject}</span>
                  <span className="text-muted-foreground">
                    {s.correct}/{s.total} ({s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-teal-500/50 transition-all"
                    style={{ width: `${s.total > 0 ? (s.correct / s.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!history || history.attempts.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">Nenhuma tentativa encontrada.</p>
          <Link to="/simulados" className="hx-btn-primary px-4 py-2 text-sm font-semibold">
            Ver simulados
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.attempts.map((attempt) => (
            <Link
              key={attempt.id}
              to={`/simulados/${attempt.examSlug}/resultado/${attempt.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition hover:border-sky-400/35"
            >
              <div>
                <p className="font-semibold text-foreground">{attempt.examTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {attempt.examType} · {attempt.correctAnswers}/{attempt.totalQuestions} acertos ·{' '}
                  {attempt.finishedAt
                    ? new Date(attempt.finishedAt).toLocaleDateString('pt-BR')
                    : '—'}
                </p>
              </div>
              <span
                className={`text-lg font-bold ${
                  attempt.score >= EXAM_PASS_SCORE ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {Math.round(attempt.score)}%
              </span>
            </Link>
          ))}
        </div>
      )}

      {history && history.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {history.page > 1 && (
            <Link
              to={`/simulados/historico?page=${history.page - 1}`}
              className="hx-btn-secondary min-h-9 px-3 py-1.5 text-sm"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Página {history.page} de {history.totalPages}
          </span>
          {history.page < history.totalPages && (
            <Link
              to={`/simulados/historico?page=${history.page + 1}`}
              className="hx-btn-secondary min-h-9 px-3 py-1.5 text-sm"
            >
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
