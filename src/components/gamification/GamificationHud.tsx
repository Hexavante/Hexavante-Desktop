import { Link } from 'react-router-dom'
import { Coins } from 'lucide-react'
import { useXpProfile } from '@/api/gamification/queries'
import { useProfile } from '@/api/users/queries'
import { BoosterIndicator } from '@/components/gamification/BoosterIndicator'

export function GamificationHud() {
  const { data: xp, isLoading: xpLoading } = useXpProfile()
  const { data: profile, isLoading: profileLoading } = useProfile()

  const isLoading = xpLoading || profileLoading

  if (isLoading) {
    return (
      <div className="hx-header-hud">
        <div className="h-11 w-20 animate-pulse rounded-lg bg-white/5" />
        <div className="hidden h-11 w-40 animate-pulse rounded-lg bg-white/5 md:block" />
      </div>
    )
  }

  if (!profile && !xp) return null

  return (
    <div className="hx-header-hud">
      {profile ? (
        <Link to="/loja" className="hx-header-hud-coins" title="Suas moedas">
          <Coins className="hx-header-hud-coins-icon" aria-hidden />
          <span className="hx-header-hud-coins-value">
            {profile.coins.toLocaleString('pt-BR')}
          </span>
        </Link>
      ) : (
        <Link to="/loja" className="hx-header-hud-coins hx-header-hud-coins--error" title="Saldo indisponível">
          <Coins className="hx-header-hud-coins-icon" aria-hidden />
          <span>—</span>
        </Link>
      )}

      <BoosterIndicator multiplier={1} expiresAt={null} />

      {xp ? (
        <Link to="/perfil" className="hx-header-hud-xp" title="Ver perfil e XP">
          <div className="hx-header-hud-xp-row">
            <span className="hx-header-hud-xp-level">Nível {xp.level}</span>
            <span className="hx-header-hud-xp-count">
              {xp.currentXp}/{xp.xpToNextLevel} XP
            </span>
          </div>
          <div
            className="hx-progress-track hx-header-hud-xp-track"
            role="progressbar"
            aria-valuenow={xp.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso de XP: ${xp.progressPercent}%`}
          >
            <div className="hx-progress-fill" style={{ width: `${xp.progressPercent}%` }} />
          </div>
        </Link>
      ) : (
        <Link to="/perfil" className="hx-header-hud-xp hx-header-hud-xp--error" title="XP indisponível">
          XP —
        </Link>
      )}
    </div>
  )
}
