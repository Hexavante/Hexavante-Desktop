import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/hooks/use-auth'
import { useProfile } from '@/api/users/queries'
import { useMyRanking, useMyAchievements } from '@/api/gamification/queries'
import { useCourses } from '@/api/courses/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Star,
  Trophy,
  Globe,
  Coins,
  BookOpen,
  Medal,
  Award,
  ClipboardList,
  User,
  type LucideIcon,
} from 'lucide-react'

function StatCard({
  label,
  value,
  icon,
  subtitle,
  onClick,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  onClick?: () => void
}) {
  const Icon = icon
  const content = (
    <div className="hx-card-interactive p-5" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={e => e.key === 'Enter' && onClick?.()}>
      <div className="flex items-center justify-between">
        <span className="truncate text-sm font-semibold text-slate-400">{label}</span>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-1 text-2xl font-black tracking-tight text-white">{value}</p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
  return content
}

function XPProgress({ currentXp, totalXp, level }: { currentXp: number; totalXp: number; level: number }) {
  const pct = totalXp > 0 ? Math.round((currentXp / totalXp) * 100) : 0
  return (
    <div className="hx-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-400">Nível {level}</span>
        <span className="text-xs text-slate-500">{currentXp} / {totalXp} XP</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function LeagueBadge({ league }: { league: string }) {
  const colors: Record<string, string> = {
    BRONZE: 'border-amber-700 bg-amber-700/10 text-amber-400',
    SILVER: 'border-slate-400 bg-slate-400/10 text-slate-300',
    GOLD: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
  }
  const medalColors: Record<string, string> = {
    GOLD: 'text-yellow-400',
    SILVER: 'text-slate-300',
    BRONZE: 'text-amber-400',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${colors[league] || colors.BRONZE}`}>
      <Medal className={`h-3.5 w-3.5 ${medalColors[league] || medalColors.BRONZE}`} /> {league}
    </span>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: ranking, isLoading: rankingLoading } = useMyRanking()
  const { data: achievementsData, isLoading: achievementsLoading } = useMyAchievements()
  const { data: coursesData, isLoading: coursesLoading } = useCourses({ limit: 6 })

  const isLoading = profileLoading || rankingLoading || achievementsLoading || coursesLoading

  if (isLoading) return <LoadingScreen />

  const achievements = achievementsData ?? []
  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const courses = coursesData?.data ?? []

  return (
    <div className="hx-page">
      <PageHeader
        title={`Olá, ${user?.name || 'Estudante'}!`}
        description="Bem-vindo ao Hexavante"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Nível"
          value={ranking?.level ?? '-'}
          icon={Star}
          subtitle={ranking?.totalXp ? `${ranking.totalXp} XP total` : undefined}
        />
        <StatCard
          label="Liga"
          value={ranking?.league ?? '-'}
          icon={Trophy}
          subtitle={ranking?.seasonKey ? `Temporada ${ranking.seasonKey}` : undefined}
        />
        <StatCard
          label="Ranking Global"
          value={ranking?.rank ? `#${ranking.rank}` : '-'}
          icon={Globe}
        />
        <StatCard
          label="Moedas"
          value={profile?.coins ?? 0}
          icon={Coins}
          onClick={() => navigate('/loja')}
        />
      </div>

      {ranking && (
        <div className="mt-4">
          <XPProgress currentXp={ranking.totalXp % 1000} totalXp={1000} level={ranking.level} />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Cursos em Destaque</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/cursos')}>
              Ver todos
            </Button>
          </div>

          {courses.length === 0 ? (
            <div className="hx-card flex min-h-[200px] items-center justify-center">
              <p className="text-sm text-slate-400">Nenhum curso disponível no momento</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {courses.slice(0, 4).map(course => (
                <div
                  key={course.id}
                  className="hx-card-interactive cursor-pointer p-4"
                  onClick={() => navigate(`/cursos/${course.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/cursos/${course.id}`)}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <BookOpen className="h-6 w-6" />
                    <Badge variant="outline" className="text-[10px]">{course.level}</Badge>
                  </div>
                  <h3 className="truncate text-sm font-bold text-white">{course.title}</h3>
                  {course.shortDescription && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">{course.shortDescription}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span>{course.totalModules} módulos</span>
                    <span>{course.totalLessons} aulas</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold text-white">Conquistas</h2>
          {unlockedAchievements.length === 0 ? (
            <div className="hx-card flex min-h-[200px] items-center justify-center">
              <p className="text-sm text-slate-400">Nenhuma conquista ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {unlockedAchievements.slice(0, 5).map(achievement => (
                <div key={achievement.key} className="hx-card flex items-center gap-3 p-3">
                  <Award className="h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{achievement.name}</p>
                    <p className="truncate text-xs text-slate-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="hx-card p-6">
          <h2 className="text-lg font-bold text-white">Acesso Rápido</h2>
          <p className="mt-1 text-sm text-slate-400">Navegue pelas seções da plataforma</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => navigate('/cursos')}>
              <BookOpen className="h-4 w-4" />
              Explorar Cursos
            </Button>
            <Button variant="outline" onClick={() => navigate('/simulados')}>
              <ClipboardList className="h-4 w-4" />
              Simulados
            </Button>
            <Button variant="outline" onClick={() => navigate('/ranking')}>
              <Trophy className="h-4 w-4" />
              Ranking
            </Button>
            <Button variant="outline" onClick={() => navigate('/perfil')}>
              <User className="h-4 w-4" />
              Meu Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
