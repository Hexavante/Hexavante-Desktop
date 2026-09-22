import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useShopState } from '@/api/shop/queries'
import { usePurchaseItem, useEquipItem } from '@/api/shop/mutations'
import { getThemeIdOf, resolveProfileBackground, resolveProfileFrame, resolveProfileIcon } from '@/lib/cosmetics'
import { EmptyState } from '@/components/shared/EmptyState'
import type { ShopItemView } from '@/domain/types/shop.types'
import {
  Check,
  Coins,
  Loader2,
  Lock,
  BookOpen,
  Rocket,
  Trophy,
  Star,
  Frame,
  Palette,
  PawPrint,
  Sparkles,
  ShoppingBag,
  Ticket,
  Zap,
  Flame,
  Brain,
  Gem,
  Shield,
  type LucideIcon,
} from 'lucide-react'

// Rótulos pt-BR para os códigos de categoria vindos da API.
const CATEGORY_LABELS: Record<string, string> = {
  TITLE: 'Títulos',
  AVATAR_BORDER: 'Bordas de Avatar',
  THEME: 'Temas',
  COSMETIC: 'Cosméticos',
  BOOSTER: 'Boosters',
  PASS: 'Passes',
  REVIEW_PACK: 'Pacotes de Revisão',
  PET: 'Pets',
  PET_COSMETIC: 'Acessórios para Pets',
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  TITLE: Trophy,
  AVATAR_BORDER: Frame,
  THEME: Palette,
  COSMETIC: Sparkles,
  BOOSTER: Rocket,
  PASS: Ticket,
  REVIEW_PACK: BookOpen,
  PET: PawPrint,
  PET_COSMETIC: Sparkles,
}

// Ordem preferida das seções; categorias desconhecidas vão para o fim.
const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS)

const EQUIPPABLE_CATEGORIES = ['TITLE', 'AVATAR_BORDER', 'THEME', 'COSMETIC']

function categoryLabel(code: string): string {
  const mapped = CATEGORY_LABELS[code]
  if (mapped) return mapped
  return code
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

function isPurchasable(item: ShopItemView): boolean {
  return item.ownershipStatus === 'available' || item.ownershipStatus === 'expired_temporary'
}

function formatBoosterExpiry(expiresAt: string | null): string | null {
  if (!expiresAt) return null
  const date = new Date(expiresAt)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function LojaSkeleton() {
  return (
    <div className="hx-page">
      <PageHeader title="Loja" description="Gaste suas moedas com itens exclusivos">
        <Skeleton className="h-8 w-24 rounded-lg" />
      </PageHeader>
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="hx-card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ShopItemCardProps {
  item: ShopItemView
  isPremium: boolean
  isPurchasing: boolean
  isEquipping: boolean
  purchaseDisabled: boolean
  equipDisabled: boolean
  onPurchase: (id: string) => void
  onEquip: (inventoryId: string) => void
}

// Metadados dos itens da loja (unknown na API — cast local).
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

function ShopItemCard({
  item,
  isPremium,
  isPurchasing,
  isEquipping,
  purchaseDisabled,
  equipDisabled,
  onPurchase,
  onEquip,
}: ShopItemCardProps) {
  const purchasable = isPurchasable(item)
  const expired = item.ownershipStatus === 'expired_temporary'
  const locked = item.isPremiumOnly && !isPremium
  const equippable = EQUIPPABLE_CATEGORIES.includes(item.category)

  return (
    <Card className="p-5">
      <div className="flex h-full flex-col">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="default">{categoryLabel(item.category)}</Badge>
            {item.isPremiumOnly ? (
              <Badge variant="violet">
                <Star className="h-3 w-3" aria-hidden="true" /> Premium
              </Badge>
            ) : null}
          </div>
          {item.isEquipped ? (
            <Badge variant="emerald">
              <Check className="h-3 w-3" aria-hidden="true" /> Em uso
            </Badge>
          ) : purchasable ? (
            expired ? (
              <Badge variant="outline">Expirado</Badge>
            ) : null
          ) : (
            <Badge variant="teal">
              <Check className="h-3 w-3" aria-hidden="true" /> Seu
            </Badge>
          )}
        </div>

        <h4 className="text-base font-bold text-foreground">{item.name}</h4>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.description}</p>

        <CosmeticPreview item={item} />

        {!purchasable && item.expiresAt ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Expira em {new Date(item.expiresAt).toLocaleDateString('pt-BR')}
          </p>
        ) : null}

        {purchasable ? (
          <div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-500">
                <Coins className="h-4 w-4" aria-hidden="true" />
                {item.cost}
              </span>
              <Button
                size="sm"
                disabled={purchaseDisabled || locked}
                onClick={() => onPurchase(item.id)}
                title={locked ? 'Exclusivo para assinantes Premium' : undefined}
                aria-label={locked ? `${item.name} (exclusivo Premium)` : `Comprar ${item.name}`}
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    {expired ? 'Renovando...' : 'Comprando...'}
                  </>
                ) : locked ? (
                  <>
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    Premium
                  </>
                ) : expired ? (
                  'Renovar'
                ) : (
                  'Comprar'
                )}
              </Button>
            </div>
            {locked ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
                Exclusivo para assinantes Premium.
              </p>
            ) : null}
          </div>
        ) : equippable && item.inventoryId ? (
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              variant={item.isEquipped ? 'outline' : 'default'}
              disabled={equipDisabled}
              onClick={() => onEquip(item.inventoryId as string)}
              aria-label={`${item.isEquipped ? 'Desequipar' : 'Equipar'} ${item.name}`}
            >
              {isEquipping ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Aguarde...
                </>
              ) : item.isEquipped ? (
                'Desequipar'
              ) : (
                'Equipar'
              )}
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  )
}

export default function LojaPage() {
  const { data: shopState, isLoading, isError, refetch } = useShopState()
  const purchaseItem = usePurchaseItem()
  const equipItem = useEquipItem()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const items = useMemo(() => shopState?.items ?? [], [shopState])
  const isPremium = shopState?.premium ?? false
  const booster = shopState?.booster
  const boosterExpiryLabel = booster?.expiresAt ? formatBoosterExpiry(booster.expiresAt) : null

  // Categorias presentes de fato na resposta, em ordem amigável.
  const categories = useMemo(() => {
    const present = [...new Set(items.map((i) => i.category))]
    return present.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a)
      const ib = CATEGORY_ORDER.indexOf(b)
      return (ia === -1 ? CATEGORY_ORDER.length : ia) - (ib === -1 ? CATEGORY_ORDER.length : ib)
    })
  }, [items])

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) counts.set(item.category, (counts.get(item.category) ?? 0) + 1)
    return counts
  }, [items])

  const visibleCategories = selectedCategory ? [selectedCategory] : categories
  const visibleCount = visibleCategories.reduce(
    (acc, category) => acc + (countByCategory.get(category) ?? 0),
    0,
  )

  const purchasingId = purchaseItem.isPending ? purchaseItem.variables : undefined
  const equippingId = equipItem.isPending ? equipItem.variables?.inventoryId : undefined

  if (isLoading) return <LojaSkeleton />

  if (isError) {
    return (
      <div className="hx-page">
        <PageHeader title="Loja" description="Gaste suas moedas com itens exclusivos" />
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" aria-hidden="true" />}
          title="Erro ao carregar a loja"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      </div>
    )
  }

  return (
    <div className="hx-page">
      <PageHeader title="Loja" description="Gaste suas moedas com itens exclusivos">
        <div className="flex items-center gap-2">
          {isPremium ? (
            <Badge variant="violet">
              <Star className="h-3 w-3" aria-hidden="true" /> Premium
            </Badge>
          ) : null}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5">
            <Coins className="h-4 w-4 text-amber-500" aria-hidden="true" />
            <span className="text-sm font-bold text-foreground">{shopState?.coins ?? 0}</span>
          </div>
        </div>
      </PageHeader>

      {booster?.active ? (
        <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border bg-surface px-4 py-3">
          <Zap className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
          <span className="text-sm font-bold text-foreground">Booster x{booster.multiplier} ativo</span>
          {boosterExpiryLabel ? (
            <span className="text-xs text-muted-foreground">até {boosterExpiryLabel}</span>
          ) : null}
          <span className="w-full text-xs text-muted-foreground sm:w-auto sm:flex-1 sm:text-right">
            Seus ganhos estão multiplicados enquanto durar.
          </span>
        </div>
      ) : null}

      {categories.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            aria-pressed={selectedCategory === null}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === null
                ? 'border-cyan/40 bg-cyan/10 text-foreground ring-1 ring-cyan/30'
                : 'border-border bg-surface text-muted-foreground hover:bg-surface-strong hover:text-foreground'
            }`}
          >
            Todas ({items.length})
          </button>
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category] ?? Sparkles
            const active = selectedCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(active ? null : category)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'border-cyan/40 bg-cyan/10 text-foreground ring-1 ring-cyan/30'
                    : 'border-border bg-surface text-muted-foreground hover:bg-surface-strong hover:text-foreground'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Icon className="h-4 w-4" aria-hidden="true" /> {categoryLabel(category)} (
                  {countByCategory.get(category) ?? 0})
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" aria-hidden="true" />}
          title="Nenhum item na loja"
          description="Novos itens serão adicionados em breve. Volte mais tarde!"
        />
      ) : null}

      {items.length > 0 && visibleCount === 0 && selectedCategory ? (
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" aria-hidden="true" />}
          title={`Nada em ${categoryLabel(selectedCategory)} por enquanto`}
          description="Tente outra categoria ou veja todos os itens."
          action={{ label: 'Limpar filtro', onClick: () => setSelectedCategory(null) }}
        />
      ) : null}

      {visibleCategories.map((category) => {
        const categoryItems = items.filter((i) => i.category === category)
        if (categoryItems.length === 0) return null
        const Icon = CATEGORY_ICONS[category] ?? Sparkles

        return (
          <section key={category} className="mb-8" aria-label={categoryLabel(category)}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <Icon className="h-5 w-5" aria-hidden="true" />
              {categoryLabel(category)}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  isPremium={isPremium}
                  isPurchasing={purchasingId === item.id}
                  isEquipping={equippingId === item.inventoryId}
                  purchaseDisabled={purchaseItem.isPending}
                  equipDisabled={equipItem.isPending}
                  onPurchase={(id) => purchaseItem.mutate(id)}
                  onEquip={(inventoryId) => {
                    const item = items.find((i) => i.inventoryId === inventoryId)
                    const themeId = item ? getThemeIdOf(item) : null
                    // Equipar tema aplica na hora; desequipar o tema ativo volta ao padrão.
                    const applyThemeId =
                      themeId == null
                        ? undefined
                        : item?.isEquipped
                          ? 'default'
                          : themeId
                    equipItem.mutate({ inventoryId, applyThemeId })
                  }}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
