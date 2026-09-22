import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfile } from '@/api/users/queries'
import { useUpdateProfile } from '@/api/users/mutations'
import { useAuth } from '@/app/hooks/use-auth'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Trophy, Award } from 'lucide-react'
import { toast } from 'sonner'
import { shopService } from '@/services/shop.service'

const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Mínimo de 2 caracteres'),
  username: z
    .string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(30, 'Máximo de 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e underscore'),
  birthDate: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

const BORDER_COLORS: Record<string, string> = {
  'border-cyan': '#22d3ee',
  'border-aurora': '#a78bfa',
  'border-gold': '#fcd34d',
  'border-crystal': '#bae6fd',
}

function getTitleTextOf(item: { metadata?: unknown }, fallback: string): string {
  const meta = item.metadata as { titleText?: unknown } | null | undefined
  if (meta && typeof meta.titleText === 'string' && meta.titleText.trim().length > 0) {
    return meta.titleText
  }
  return fallback
}

function getBorderIdOf(item: { metadata?: unknown }): string | null {
  const meta = item.metadata as { borderId?: unknown } | null | undefined
  return typeof meta?.borderId === 'string' && meta.borderId.length > 0 ? meta.borderId : null
}

export default function PerfilPage() {
  const { user } = useAuth()
  const { data: profile, isLoading, isError, refetch } = useProfile()
  const updateProfile = useUpdateProfile()
  const [editing, setEditing] = useState(false)
  const [equippedTitle, setEquippedTitle] = useState<string | null>(null)
  const [equippedBadge, setEquippedBadge] = useState<string | null>(null)
  const [equippedBorderId, setEquippedBorderId] = useState<string | null>(null)

  useEffect(() => {
    shopService
      .getInventory()
      .then((data) => {
        const items = data?.items ?? []
        const titleEntry = items.find((e) => e.isEquipped && e.item.category === 'TITLE')
        if (titleEntry) {
          setEquippedTitle(getTitleTextOf(titleEntry.item, titleEntry.item.name))
        }
        const badgeEntry = items.find((e) => e.isEquipped && e.item.category === 'BADGE')
        if (badgeEntry) {
          setEquippedBadge(badgeEntry.item.name)
        }
        const borderEntry = items.find((e) => e.isEquipped && e.item.category === 'AVATAR_BORDER')
        if (borderEntry) {
          const borderId = getBorderIdOf(borderEntry.item)
          if (borderId) setEquippedBorderId(borderId)
        }
      })
      .catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    values: profile
      ? {
          fullName: profile.fullName,
          username: profile.username,
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
        }
      : undefined,
  })

  async function onSubmit(data: ProfileFormData) {
    updateProfile.mutate(
      {
        fullName: data.fullName,
        username: data.username,
        birthDate: data.birthDate || undefined,
      },
      {
        onSuccess: () => {
          setEditing(false)
          toast.success('Perfil atualizado!')
        },
        onError: () => {
          toast.error('Erro ao atualizar perfil')
        },
      }
    )
  }

  if (isLoading) return <LoadingScreen />

  const userProfile = profile

  if (!userProfile) {
    return (
      <div className="hx-page">
        <PageHeader title="Perfil" />
        <p className="text-sm text-muted-foreground">
          {isError ? 'Não foi possível carregar o perfil.' : 'Erro ao carregar perfil'}
        </p>
        {isError ? (
          <button type="button" className="hx-btn hx-btn-primary mt-4" onClick={() => void refetch()}>
            Tentar novamente
          </button>
        ) : null}
      </div>
    )
  }

  const borderColor = equippedBorderId
    ? (BORDER_COLORS[equippedBorderId] ?? 'hsl(var(--sidebar-highlight))')
    : undefined

  return (
    <div className="hx-page">
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais"
      >
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="hx-card flex flex-col items-center p-6">
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-3xl font-black text-cyan-400 ${borderColor ? 'border-2 border-solid' : ''}`}
              style={borderColor ? { borderColor } : undefined}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">{userProfile.fullName}</h2>
            <p className="text-sm text-muted-foreground">@{userProfile.username}</p>

            {equippedTitle || equippedBadge ? (
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                {equippedTitle ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                    <Trophy className="h-3 w-3" aria-hidden="true" />
                    {equippedTitle}
                  </span>
                ) : null}
                {equippedBadge ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
                    <Award className="h-3 w-3" aria-hidden="true" />
                    {equippedBadge}
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="mt-4 flex gap-2">
              {userProfile.isPremium && <Badge><Star className="h-3 w-3" /> Premium</Badge>}
              {userProfile.isVerified && <Badge variant="secondary">✓ Verificado</Badge>}
            </div>

            <div className="mt-6 flex w-full justify-around text-center">
              <div>
                <p className="text-xl font-bold text-foreground">{userProfile.coins}</p>
                <p className="text-xs text-muted-foreground">Moedas</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{userProfile.isPremium ? 'Sim' : 'Não'}</p>
                <p className="text-xs text-muted-foreground">Premium</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="hx-card p-6">
            <h3 className="mb-4 text-sm font-bold text-foreground">
              {editing ? 'Editar Informações' : 'Informações Pessoais'}
            </h3>

            {editing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="hx-label">Nome completo</label>
                  <input className="hx-input" {...register('fullName')} />
                  {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="hx-label">Nome de usuário</label>
                  <input className="hx-input" {...register('username')} />
                  {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
                </div>

                <div>
                  <label className="hx-label">Data de nascimento</label>
                  <input className="hx-input" type="date" {...register('birthDate')} />
                  {errors.birthDate && <p className="mt-1 text-xs text-red-400">{errors.birthDate.message}</p>}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setEditing(false); reset() }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nome de usuário</p>
                    <p className="text-sm text-foreground">@{userProfile.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data de nascimento</p>
                    <p className="text-sm text-foreground">
                      {userProfile.birthDate
                        ? new Date(userProfile.birthDate).toLocaleDateString('pt-BR')
                        : 'Não informada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Membro desde</p>
                    <p className="text-sm text-foreground">
                      {new Date(userProfile.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                {(userProfile.phone || userProfile.city || userProfile.bio) && (
                  <>
                    <hr className="border-border" />
                    {userProfile.phone && (
                      <div>
                        <p className="text-xs text-muted-foreground">Telefone</p>
                        <p className="text-sm text-foreground">{userProfile.phone}</p>
                      </div>
                    )}
                    {userProfile.city && userProfile.state && (
                      <div>
                        <p className="text-xs text-muted-foreground">Localização</p>
                        <p className="text-sm text-foreground">{userProfile.city}, {userProfile.state}</p>
                      </div>
                    )}
                    {userProfile.bio && (
                      <div>
                        <p className="text-xs text-muted-foreground">Bio</p>
                        <p className="text-sm text-foreground">{userProfile.bio}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
