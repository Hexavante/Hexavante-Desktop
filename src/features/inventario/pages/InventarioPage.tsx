import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useInventory, useShopState } from '@/api/shop/queries'
import { useEquipItem } from '@/api/shop/mutations'
import { getThemeIdOf, resolveProfileBackground, resolveProfileFrame, resolveProfileIcon } from '@/lib/cosmetics'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  Backpack,
  Rocket,
  BookOpen,
  Trophy,
  Frame,
  Palette,
  Sparkles,
  Ticket,
  Flame,
  Brain,
  Star,
  Gem,
  Shield,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  TITLE: 'Títulos',
  AVATAR_BORDER: 'Bordas de Avatar',
  THEME: 'Temas',
  COSMETIC: 'Cosméticos',
  BOOSTER: 'Boosters',
  PASS: 'Passes',
  REVIEW_PACK: 'Pacotes de Revisão',
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  TITLE: Trophy,
  AVATAR_BORDER: Frame,
  THEME: Palette,
  COSMETIC: Sparkles,
  BOOSTER: Rocket,
  PASS: Ticket,
  REVIEW_PACK: BookOpen,
}

const EQUIPPABLE_CATEGORIES = ['TITLE', 'AVATAR_BORDER', 'THEME', 'COSMETIC', 'BADGE', 'FRAME', 'PROFILE_BACKGROUND', 'EMOJI_PACK']

// Metadados dos itens do inventário (unknown na API — cast local).
type CosmeticMetadata = {
  frameId?: unknown
  backgroundId?: unknown
  iconId?: unknown
  cosmeticType?: unknown
}

function metadataOf(item: { metadata?: unknown }): CosmeticMetadata {
  const meta = item.metadata
  return (meta && typeof meta === 'object' ? meta : {}) as CosmeticMetadata
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

const COSMETIC_ICON_COMPONENTS: Record<string, LucideIcon> = {
  Flame,
  Brain,
  Trophy,
  Star,
  Rocket,
  Gem,
  Shield,
  BookOpen,
}

// Preview silencioso do cosmético (moldura, fundo ou ícone). Sem o mapa = nada.
function CosmeticPreview({ item }: { item: { category: string; metadata?: unknown } }) {
  const meta = metadataOf(item)

  const frame = resolveProfileFrame(asString(meta.frameId))
  if (frame) {
    return (
      <div className="mt-3 flex items-center gap-2">
        <div
          aria-hidden="true"
          className={frame.animationClass ?? ''}
          style={{ width: 40, height: 40, ...frame.style }}
        />
        <span className="text-xs text-muted-foreground">{frame.label}</span>
      </div>
    )
  }

  const background = resolveProfileBackground(asString(meta.backgroundId))
  if (background) {
    return (
      <div className="mt-3 flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`inline-block h-6 w-6 shrink-0 rounded-full ${background.animationClass ?? ''}`}
          style={{ ...background.style }}
        />
        <span className="text-xs text-muted-foreground">{background.label}</span>
      </div>
    )
  }

  if (item.category === 'COSMETIC' && meta.cosmeticType === 'profile_icon') {
    const icon = resolveProfileIcon(asString(meta.iconId))
    const Icon = icon ? COSMETIC_ICON_COMPONENTS[icon.lucideName] : undefined
    if (icon && Icon) {
      return (
        <div className="mt-3 flex items-center gap-2">
          <Icon className={`h-6 w-6 ${icon.className}`} aria-hidden="true" />
          <span className="text-xs text-muted-foreground">{icon.label}</span>
        </div>
      )
    }
  }

  return null
}

export default function InventarioPage() {
  const { data, isLoading, isError, refetch } = useInventory()
  const { data: shopState } = useShopState()
  const booster = shopState?.booster
  const equipItem = useEquipItem()
  const [tab, setTab] = useState<string>('all')

  if (isLoading) return <LoadingScreen />

  if (isError) {
    return (
      <div className="hx-page">
        <PageHeader title="Inventário" description="Seus itens adquiridos" />
        <EmptyState
          title="Erro ao carregar o inventário"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      </div>
    )
  }

  const inventory = data?.items ?? []

  const categories = tab === 'all'
    ? ['COSMETIC', 'AVATAR_BORDER', 'TITLE', 'THEME', 'BOOSTER', 'PASS', 'REVIEW_PACK']
    : [tab]

  return (
    <div className="hx-page">
      <PageHeader title="Inventário" description="Seus itens adquiridos" />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            tab === 'all'
              ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/40'
              : 'bg-surface text-muted-foreground hover:bg-surface-strong hover:text-foreground'
          }`}
        >
          Todos ({inventory.length})
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const count = inventory.filter((i) => i.item.category === key).length
          if (count === 0) return null
          const Icon = CATEGORY_ICONS[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                tab === key
                  ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/40'
                  : 'bg-surface text-muted-foreground hover:bg-surface-strong hover:text-foreground'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon className="h-4 w-4" /> {label} ({count})
              </span>
            </button>
          )
        })}
      </div>

      {categories.map((category) => {
        const items = inventory.filter((i) => i.item.category === category)
        if (items.length === 0) return null
        const Icon = CATEGORY_ICONS[category]

        return (
          <div key={category} className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <Icon className="h-5 w-5" />
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((entry) => (
                <Card key={entry.id} className="p-5">
                  <div className="flex h-full flex-col">
                    <div className="mb-3 flex items-start justify-between">
                      <Badge variant={entry.item.isPremiumOnly ? 'violet' : 'default'}>
                        {CATEGORY_LABELS[entry.item.category] ?? entry.item.category}
                      </Badge>
                      {entry.isEquipped && (
                        <Badge variant="emerald">Equipado</Badge>
                      )}
                      {entry.item.category === 'BOOSTER' && booster?.active ? (
                        <Badge variant="emerald">
                          <Zap className="h-3 w-3" aria-hidden="true" /> Ativo x{booster.multiplier}
                        </Badge>
                      ) : null}
                    </div>

                    <h4 className="text-base font-bold text-foreground">{entry.item.name}</h4>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{entry.item.description}</p>

                    <CosmeticPreview item={entry.item} />

                    {entry.expiresAt && (
                      <p className="mt-2 text-xs text-amber-400">
                        Expira: {new Date(entry.expiresAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}

                    {EQUIPPABLE_CATEGORIES.includes(entry.item.category) && (
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant={entry.isEquipped ? 'outline' : 'default'}
                          disabled={equipItem.isPending}
                          onClick={() => {
                            const themeId = getThemeIdOf(entry.item)
                            const applyThemeId =
                              themeId == null
                                ? undefined
                                : entry.isEquipped
                                  ? 'default'
                                  : themeId
                            equipItem.mutate({ inventoryId: entry.id, applyThemeId })
                          }}
                        >
                          {entry.isEquipped ? 'Desequipar' : 'Equipar'}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {inventory.length === 0 && (
        <EmptyState
          icon={<Backpack className="h-12 w-12 text-muted-foreground" aria-hidden="true" />}
          title="Inventário vazio"
          description="Compre itens na loja para vê-los aqui."
        />
      )}
    </div>
  )
}
