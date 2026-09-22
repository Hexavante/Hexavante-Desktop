import { useState } from 'react'
import { useRankings, useMyRanking } from '@/api/gamification/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Medal } from 'lucide-react'
import { useAuth } from '@/app/hooks/use-auth'

const MEDAL_COLORS: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-slate-400',
  3: 'text-orange-400',
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) return <Medal className={`h-5 w-5 ${MEDAL_COLORS[rank]}`} />
  return <span className="w-6 text-center text-sm font-bold text-muted-foreground">#{rank}</span>
}

function LeagueIcon({ league }: { league: string }) {
  const colors: Record<string, string> = {
    BRONZE: 'text-orange-400',
    SILVER: 'text-slate-400',
    GOLD: 'text-amber-400',
  }
  return <Medal className={`h-4 w-4 ${colors[league] || colors.BRONZE}`} />
}

export default function RankingPage() {
  const [page, setPage] = useState(1)
  const { user } = useAuth()
  const { data, isLoading, isError, refetch } = useRankings({ page, limit: 20 })
  const { data: myRanking } = useMyRanking()

  if (isError) {
    return (
      <div className="hx-page">
        <PageHeader
          title="Ranking"
          description="Veja os melhores estudantes da plataforma"
        />
        <EmptyState
          title="Erro ao carregar ranking"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      </div>
    )
  }

  return (
    <div className="hx-page">
      <PageHeader
        title="Ranking"
        description="Veja os melhores estudantes da plataforma"
      />

      {myRanking && (
        <div className="hx-card mb-6 flex items-center gap-4 p-4">
          <span className="text-2xl">
            {myRanking.rank <= 3 ? (
              <Medal className={`h-6 w-6 ${MEDAL_COLORS[myRanking.rank]}`} />
            ) : (
              `#${myRanking.rank}`
            )}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Sua posição</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{myRanking.totalXp} XP • Nível {myRanking.level}</span>
              <LeagueIcon league={myRanking.league} />
              <span className="text-xs text-muted-foreground">{myRanking.league}</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Temporada {myRanking.seasonKey}</span>
        </div>
      )}

      {isLoading ? (
        <LoadingScreen />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="Nenhum ranking disponível"
          description="Os rankings serão gerados conforme os alunos ganharem XP"
        />
      ) : (
        <>
          <div className="hx-card overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-2 border-b border-border px-4 py-3 text-xs font-semibold text-muted-foreground">
              <span>#</span>
              <span>Estudante</span>
              <span className="text-center">Nível</span>
              <span className="text-center">Liga</span>
              <span className="text-right">XP</span>
            </div>
            <div className="divide-y divide-border">
              {data.data.map(entry => {
                const isMe = user && entry.userId === user.id
                return (
                  <div
                    key={entry.rank}
                    className={`grid grid-cols-[40px_1fr_80px_80px_80px] items-center gap-2 px-4 py-3 transition hover:bg-surface ${isMe ? 'bg-cyan-500/5' : ''}`}
                  >
                    <RankBadge rank={entry.rank} />
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-semibold text-muted-foreground">
                        {entry.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {entry.fullName}
                          {isMe && <span className="ml-1 text-xs text-cyan-400">(você)</span>}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">@{entry.username}</p>
                      </div>
                    </div>
                    <span className="text-center text-sm text-muted-foreground">{entry.level}</span>
                    <span className="flex justify-center">
                      <LeagueIcon league={entry.league} />
                    </span>
                    <span className="text-right text-sm font-semibold text-foreground">
                      {entry.totalXp.toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {data.pagination.page} de {data.pagination.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
