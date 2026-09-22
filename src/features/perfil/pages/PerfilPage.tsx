import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfile } from '@/api/users/queries'
import { useUpdateProfile } from '@/api/users/mutations'
import { useMyAchievements } from '@/api/gamification/queries'
import { useAuth } from '@/app/hooks/use-auth'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Trophy,
  Award,
  Flame,
  Brain,
  Rocket,
  Gem,
  Shield,
  BookOpen,
  Medal,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { shopService } from '@/services/shop.service'
import {
  resolveProfileBackground,
  resolveProfileFrame,
  resolveProfileIcon,
} from '@/lib/cosmetics'

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

// Metadados dos itens da loja (unknown na API — cast local).
type CosmeticMetadata = {
  frameId?: unknown
  backgroundId?: unknown
  iconId?: unknown
  titleText?: unknown
  borderId?: unknown
  badgeId?: unknown
  cosmeticType?: unknown
}

function metadataOf(item: { metadata?: unknown }): CosmeticMetadata {
  const meta = item.metadata
  return (meta && typeof meta === 'object' ? meta : {}) as CosmeticMetadata
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function getTitleTextOf(item: { metadata?: unknown }, fallback: string): string {
  const text = asString(metadataOf(item).titleText)
  return text && text.trim().length > 0 ? text : fallback
}

function getBorderIdOf(item: { metadata?: unknown }): string | null {
  return asString(metadataOf(item).borderId)
}

// Ícones lucide disponíveis para cosmeticType === 'profile_icon'.
const PROFILE_ICON_COMPONENTS: Record<string, LucideIcon> = {
  Flame,
  Brain,
  Trophy,
  Star,
  Rocket,
  Gem,
  Shield,
  BookOpen,
}

export default function PerfilPage() {
  const { user } = useAuth()
  const { data: profile, isLoading, isError, refetch } = useProfile()
  const { data: achievementsData } = useMyAchievements()
  const updateProfile = useUpdateProfile()
  const [editing, setEditing] = useState(false)
  const [equippedTitle, setEquippedTitle] = useState<string | null>(null)
  const [equippedBadge, setEquippedBadge] = useState<string | null>(null)
  const [equippedBorderId, setEquippedBorderId] = useState<string | null>(null)
  const [equippedFrameId, setEquippedFrameId] = useState<string | null>(null)
  const [equippedBackgroundId, setEquippedBackgroundId] = useState<string | null>(null)
  const [equippedIconId, setEquippedIconId] = useState<string | null>(null)

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
        const frameEntry = items.find(
          (e) => e.isEquipped && resolveProfileFrame(asString(metadataOf(e.item).frameId)) !== null,
        )
        if (frameEntry) {
          const frameId = asString(metadataOf(frameEntry.item).frameId)
          if (frameId) setEquippedFrameId(frameId)
        }
        const backgroundEntry = items.find(
          (e) =>
            e.isEquipped &&
            resolveProfileBackground(asString(metadataOf(e.item).backgroundId)) !== null,
        )
        if (backgroundEntry) {
          const backgroundId = asString(metadataOf(backgroundEntry.item).backgroundId)
          if (backgroundId) setEquippedBackgroundId(backgroundId)
        }
        const iconEntry =
          items.find(
            (e) =>
              e.isEquipped &&
              e.item.category === 'COSMETIC' &&
              metadataOf(e.item).cosmeticType === 'profile_icon' &&
              resolveProfileIcon(asString(metadataOf(e.item).iconId)) !== null,
          ) ??
          items.find(
            (e) =>
              e.isEquipped &&
              resolveProfileIcon(asString(metadataOf(e.item).iconId)) !== null,
          )
        if (iconEntry) {
          const iconId = asString(metadataOf(iconEntry.item).iconId)
          if (iconId) setEquippedIconId(iconId)
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

  const equippedFrame = resolveProfileFrame(equippedFrameId)
  const equippedBackground = resolveProfileBackground(equippedBackgroundId)
  const equippedIcon = resolveProfileIcon(equippedIconId)
  const EquippedIconComponent = equippedIcon ? PROFILE_ICON_COMPONENTS[equippedIcon.lucideName] : undefined

  const recentAchievements = (achievementsData ?? [])
    .filter((a) => a.unlocked && a.unlockedAt)
    .sort((a, b) => +new Date(b.unlockedAt as string) - +new Date(a.unlockedAt as string))
    .slice(0, 5)

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
          <div
            className={`hx-card flex flex-col items-center p-6 ${equippedBackground?.animationClass ?? ''}`}
            style={equippedBackground ? { ...equippedBackground.style } : undefined}
          >
            <div
              className={
                equippedFrame
                  ? `flex h-24 w-24 items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-3xl font-black text-cyan-400 ${equippedFrame.animationClass ?? ''}`
                  : `flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-3xl font-black text-cyan-400 ${borderColor ? 'border-2 border-solid' : ''}`
              }
              style={equippedFrame ? { ...equippedFrame.style } : borderColor ? { borderColor } : undefined}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-4 inline-flex items-center gap-2 text-lg font-bold text-foreground">
              {userProfile.fullName}
              {EquippedIconComponent && equippedIcon ? (
                <EquippedIconComponent
                  className={`h-5 w-5 ${equippedIcon.className}`}
                  aria-label={equippedIcon.label}
                />
              ) : null}
            </h2>
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

          {recentAchievements.length > 0 ? (
            <div className="hx-card mt-6 p-6">
              <h3 className="mb-4 text-sm font-bold text-foreground">Atividade recente</h3>
              <ul className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <li key={achievement.key} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                      <Medal className="h-4 w-4 text-amber-500" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        Conquista desbloqueada: {achievement.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.unlockedAt ? (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
