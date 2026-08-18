import { useProfile } from '@/api/users/queries'
import { useMyRanking, useMyAchievements } from '@/api/gamification/queries'
import { useAuth } from '@/app/hooks/use-auth'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { Badge } from '@/components/ui/badge'

function StatCard({ label, value, subtitle }: { label: string; value: string | number; subtitle?: string }) {
  return (
    <div className="hx-card p-5">
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-white">{value}</p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}

export default function EstatisticasPage() {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: ranking, isLoading: rankingLoading } = useMyRanking()
  const { data: achievementsData, isLoading: achievementsLoading } = useMyAchievements()

  const isLoading = profileLoading || rankingLoading || achievementsLoading

  if (isLoading) return <LoadingScreen />

  const achievements = achievementsData ?? []
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="hx-page">
      <PageHeader title="Estatísticas" description="Seu desempenho na plataforma" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Nível" value={ranking?.level ?? '-'} />
        <StatCard label="Total de XP" value={ranking?.totalXp?.toLocaleString() ?? '-'} />
        <StatCard label="Ranking Global" value={ranking?.rank ? `#${ranking.rank}` : '-'} subtitle={ranking?.seasonKey ? `Temporada ${ranking.seasonKey}` : undefined} />
        <StatCard label="Moedas" value={profile?.coins ?? 0} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="hx-card p-5">
          <h3 className="mb-3 text-sm font-bold text-white">Informações da Conta</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Membro desde</span>
              <span className="text-sm text-white">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('pt-BR') : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Premium</span>
              <Badge variant={profile?.isPremium ? 'default' : 'outline'}>{profile?.isPremium ? 'Sim' : 'Não'}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Verificado</span>
              <Badge variant={profile?.isVerified ? 'default' : 'outline'}>{profile?.isVerified ? 'Sim' : 'Não'}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Liga Atual</span>
              <span className="text-sm font-semibold text-white">{ranking?.league ?? '-'}</span>
            </div>
          </div>
        </div>

        <div className="hx-card p-5">
          <h3 className="mb-3 text-sm font-bold text-white">Conquistas</h3>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-3xl font-black text-white">{unlockedCount}</p>
              <p className="text-xs text-slate-400">desbloqueadas</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-600">{achievements.length}</p>
              <p className="text-xs text-slate-400">total</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{ width: `${achievements.length > 0 ? (unlockedCount / achievements.length) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}% completo
          </p>
        </div>
      </div>
    </div>
  )
}
