import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useModerationStats, useModerationUsers } from '@/api/moderation/queries'
import { useBanUser, useMuteUser, useWarnUser, useUnbanUser, useUnmuteUser } from '@/api/moderation/mutations'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ModerationUser } from '@/domain/types/moderation.types'
import { ROLES_LABELS } from '@/domain/types/moderation.types'

const actionSchema = z.object({
  reason: z.string().min(3, 'Razão deve ter pelo menos 3 caracteres').max(500),
  durationHours: z.coerce.number().int().min(1).max(8760).optional(),
})

type ActionForm = z.infer<typeof actionSchema>

type ActionType = 'ban' | 'mute' | 'warn'
type StatusFilter = 'all' | 'active' | 'banned' | 'muted'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'banned', label: 'Banidos' },
  { value: 'muted', label: 'Silenciados' },
]

function StatCard({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className={`hx-card p-4 ${highlight ? 'ring-1 ring-cyan-500/30' : ''}`}>
      <div className={`text-2xl font-black ${highlight ? 'text-cyan-400' : 'text-foreground'}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function ActionDialog({
  open,
  onOpenChange,
  action,
  user,
  onConfirm,
  isPending,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  action: ActionType
  user: ModerationUser | null
  onConfirm: (data: ActionForm) => void
  isPending: boolean
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ActionForm>({
    resolver: zodResolver(actionSchema),
  })

  const labels: Record<ActionType, string> = {
    ban: 'Banir',
    mute: 'Silenciar',
    warn: 'Advertir',
  }

  const titles: Record<ActionType, string> = {
    ban: 'Banir usuário',
    mute: 'Silenciar usuário',
    warn: 'Registrar advertência',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {titles[action]}{user ? ` · @${user.username ?? user.id.slice(0, 8)}` : ''}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => onConfirm(data))}
          className="space-y-4"
        >
          <div>
            <label className="hx-label">Motivo</label>
            <textarea
              className="hx-input min-h-[80px] resize-y"
              placeholder="Descreva o motivo da ação"
              {...register('reason')}
            />
            {errors.reason && <p className="mt-1 text-xs text-red-400">{errors.reason.message}</p>}
          </div>
          {action !== 'warn' && (
            <div>
              <label className="hx-label">Duração (horas, opcional)</label>
              <input className="hx-input" type="number" placeholder="ex: 24 (vazio = permanente)" {...register('durationHours')} />
              {errors.durationHours && <p className="mt-1 text-xs text-red-400">{errors.durationHours.message}</p>}
            </div>
          )}
          <Button type="submit" disabled={isPending} className="w-full" variant="danger">
            {isPending ? 'Processando...' : `Confirmar ${labels[action].toLowerCase()}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ModerationPage() {
  const [status, setStatus] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { data: stats, isLoading: statsLoading } = useModerationStats()
  const { data: users, isLoading: usersLoading } = useModerationUsers({
    status: status === 'all' ? undefined : status,
    search: debouncedSearch || undefined,
    limit: 100,
  })

  const [actionState, setActionState] = useState<{ type: ActionType; user: ModerationUser | null } | null>(null)

  const ban = useBanUser(() => setActionState(null))
  const mute = useMuteUser(() => setActionState(null))
  const warn = useWarnUser(() => setActionState(null))
  const unban = useUnbanUser()
  const unmute = useUnmuteUser()

  const actionMut = actionState?.type === 'ban' ? ban : actionState?.type === 'mute' ? mute : warn

  function handleSearch(value: string) {
    setSearch(value)
    window.setTimeout(() => setDebouncedSearch(value), 400)
  }

  if (statsLoading) return <LoadingScreen />

  return (
    <div className="hx-page">
      <PageHeader title="Moderação" description="Gestão de usuários e penalidades" />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Usuários ativos hoje" value={stats?.activeToday ?? 0} />
        <StatCard label="Total de usuários" value={stats?.totalUsers ?? 0} />
        <StatCard label="Banidos ativos" value={stats?.activeBans ?? 0} highlight={!!(stats?.activeBans)} />
        <StatCard label="Silenciados" value={stats?.activeMutes ?? 0} />
        <StatCard label="XP hoje" value={stats?.xpToday ?? 0} />
        <StatCard label="Moedas no sistema" value={stats?.totalCoins ?? 0} />
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          className="hx-input md:max-w-xs"
          placeholder="Buscar por nome, username ou email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex gap-1 rounded-lg bg-surface p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${status === opt.value ? 'bg-cyan-500/20 text-cyan-400' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setStatus(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hx-card overflow-hidden">
        {usersLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Carregando usuários...</div>
        ) : !users || users.length === 0 ? (
          <div className="p-8">
            <EmptyState title="Nenhum usuário encontrado" description="Ajuste a busca ou o filtro de status." />
          </div>
        ) : (
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_1fr] gap-2 px-4 py-3 text-xs font-semibold text-muted-foreground">
              <span>Usuário</span>
              <span>Cargos</span>
              <span>Nível</span>
              <span>Status</span>
              <span className="text-right">Ações</span>
            </div>
            {users.map((u) => (
              <div key={u.id} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_1fr] items-center gap-2 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-foreground">
                    {u.username ? `@${u.username}` : u.email}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{u.fullName ?? u.email}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {u.roles.slice(0, 2).map((r) => (
                    <Badge key={r} variant="outline" className="text-[10px]">{ROLES_LABELS[r] ?? r}</Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {u.level} <span className="text-xs text-muted-foreground">({u.xp} XP)</span>
                </div>
                <div>
                  {u.isBanned ? (
                    <Badge variant="destructive" className="text-[10px]">Banido</Badge>
                  ) : u.isMuted ? (
                    <Badge variant="secondary" className="text-[10px]">Silenciado</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">Ativo</Badge>
                  )}
                  {u.warnings > 0 && (
                    <span className="ml-1 text-[10px] text-amber-400">{u.warnings} adv.</span>
                  )}
                </div>
                <div className="flex justify-end gap-1">
                  {!u.isBanned && !u.isMuted && (
                    <>
                      <Button size="sm" variant="danger" onClick={() => setActionState({ type: 'ban', user: u })}>Banir</Button>
                      <Button size="sm" variant="accent" onClick={() => setActionState({ type: 'mute', user: u })}>Silenciar</Button>
                    </>
                  )}
                  {u.isBanned && (
                    <Button size="sm" variant="outline" onClick={() => unban.mutate(u.id)}>Desbanir</Button>
                  )}
                  {u.isMuted && (
                    <Button size="sm" variant="outline" onClick={() => unmute.mutate(u.id)}>Dessilenciar</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setActionState({ type: 'warn', user: u })}>Advertir</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ActionDialog
        open={!!actionState}
        onOpenChange={(v) => { if (!v) setActionState(null) }}
        action={actionState?.type ?? 'warn'}
        user={actionState?.user ?? null}
        isPending={actionMut.isPending}
        onConfirm={(data) => {
          if (!actionState?.user) return
          const body = { reason: data.reason, durationHours: data.durationHours }
          actionMut.mutate({ userId: actionState.user.id, body })
        }}
      />
    </div>
  )
}