import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { useExams } from '@/api/exams/queries'
import { BarChart3, Clock3, ClipboardList, Crown, Search, Target } from 'lucide-react'

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

export default function SimuladosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tipo, setTipo] = useState<string>('')
  const [sort, setSort] = useState<string>('recent')

  const { data: exams, isLoading, isError, refetch } = useExams({ q: searchQuery || undefined, tipo: tipo || undefined, sort })

  if (isLoading) return <LoadingScreen />

  if (isError) {
    return (
      <div className="hx-page">
        <PageHeader title="Simulados" description="Teste seus conhecimentos" />
        <EmptyState
          title="Erro ao carregar simulados"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      </div>
    )
  }

  return (
    <div className="hx-page">
      <PageHeader
        title="Simulados"
        description="Teste seus conhecimentos"
        action={
          <Link
            to="/simulados/historico"
            className="hx-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          >
            <BarChart3 className="h-4 w-4 text-teal-300" />
            Histórico
          </Link>
        }
      />

      <Card  className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar simulado..."
              className="hx-input w-full pl-10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="hx-input w-full sm:w-40"
          >
            <option value="recent">Mais recentes</option>
            <option value="popular">Mais populares</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTipo('')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              !tipo
                ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/40'
                : 'bg-surface text-muted-foreground hover:bg-surface'
            }`}
          >
            Todos
          </button>
          {Object.entries(EXAM_TYPE_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTipo(value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                tipo === value
                  ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/40'
                  : 'bg-surface text-muted-foreground hover:bg-surface'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <p className="mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{exams?.length ?? 0}</span> simulados encontrados
      </p>

      {!exams || exams.length === 0 ? (
        <EmptyState
          title="Nenhum simulado encontrado"
          description={searchQuery || tipo ? 'Tente ajustar a busca ou os filtros.' : 'Novos simulados serão publicados em breve.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Link
              key={exam.id}
              to={`/simulados/${exam.slug}`}
              className="group block overflow-hidden rounded-xl border border-border bg-surface transition hover:border-teal-400/35 hover:bg-surface"
            >
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-teal-900/50 to-slate-900">
                <ClipboardList className="h-10 w-10 text-teal-400/50" />
              </div>
              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant={EXAM_BADGE_VARIANTS[exam.examType] ?? 'default'}>
                    <Target className="h-3.5 w-3.5" />
                    {EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}
                  </Badge>
                  {exam.isPremiumOnly && (
                    <Badge variant="violet">
                      <Crown className="h-3.5 w-3.5" />
                      Premium
                    </Badge>
                  )}
                </div>

                <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-teal-200">
                  {exam.title}
                </h3>
                {exam.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {exam.description}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-4 text-xs font-medium text-muted-foreground">
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
                  {exam.userAttemptCount > 0 && (
                    <span>
                      {exam.userAttemptCount} tentativa{exam.userAttemptCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
