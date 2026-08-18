import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

type Props = {
  multiplier: number
  expiresAt: string | null
}

function formatRemaining(ms: number) {
  if (ms <= 0) return '00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function BoosterIndicator({ multiplier, expiresAt }: Props) {
  const [remainingMs, setRemainingMs] = useState(0)

  useEffect(() => {
    if (!expiresAt) return
    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now()
      setRemainingMs(Math.max(0, ms))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [expiresAt])

  if (!expiresAt || multiplier <= 1 || remainingMs <= 0) return null

  return (
    <span
      className="booster-indicator hidden items-center gap-1 rounded-lg border border-violet-400/30 bg-violet-500/15 px-2 py-1 text-xs font-bold text-violet-100 sm:inline-flex"
      title="Booster de recompensas ativo"
    >
      <Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-300" />
      <span>{multiplier}x</span>
      <span className="font-mono text-[10px] text-violet-200/90">
        {formatRemaining(remainingMs)}
      </span>
    </span>
  )
}
