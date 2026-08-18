import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useShopState } from '@/api/shop/queries'
import { usePurchaseItem, useEquipItem } from '@/api/shop/mutations'
import { LoadingScreen } from '@/components/shared/LoadingScreen'

const CATEGORY_LABELS: Record<string, string> = {
  TITLE: 'Títulos',
  AVATAR_BORDER: 'Bordas de Avatar',
  THEME: 'Temas',
  COSMETIC: 'Cosméticos',
  BOOSTER: 'Boosters',
  PASS: 'Passes',
  REVIEW_PACK: 'Pacotes de Revisão',
}

const CATEGORY_ICONS: Record<string, string> = {
  TITLE: '🏆',
  AVATAR_BORDER: '🖼️',
  THEME: '🎨',
  COSMETIC: '✨',
  BOOSTER: '🚀',
  PASS: '🎫',
  REVIEW_PACK: '📚',
}

const EQUIPPABLE_CATEGORIES = ['TITLE', 'AVATAR_BORDER', 'THEME', 'COSMETIC']

export default function LojaPage() {
  const { data: shopState, isLoading } = useShopState()
  const purchaseItem = usePurchaseItem()
  const equipItem = useEquipItem()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  if (isLoading) return <LoadingScreen />

  const categories = selectedCategory
    ? [selectedCategory]
    : ['TITLE', 'AVATAR_BORDER', 'THEME', 'COSMETIC', 'BOOSTER', 'PASS', 'REVIEW_PACK']

  return (
    <div className="hx-page">
      <PageHeader title="Loja" description="Gaste suas moedas com itens exclusivos">
        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5">
          <span className="text-sm">🪙</span>
          <span className="text-sm font-bold text-amber-400">{shopState?.coins ?? 0}</span>
        </div>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            !selectedCategory
              ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/40'
              : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
          }`}
        >
          Todas
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedCategory(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === key
                ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/40'
                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
            }`}
          >
            {CATEGORY_ICONS[key]} {label}
          </button>
        ))}
      </div>

      {categories.map((category) => {
        const items = shopState?.items.filter((i) => i.category === category) ?? []
        if (items.length === 0) return null

        return (
          <div key={category} className="mb-8">
            <h3 className="mb-4 text-lg font-bold text-white">
              {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} >
                  <div className="flex h-full flex-col">
                    <div className="mb-3 flex items-start justify-between">
                      <Badge variant={item.isPremiumOnly ? 'violet' : 'default'}>
                        {item.isPremiumOnly ? '⭐ Premium' : item.category}
                      </Badge>
                      {item.ownershipStatus !== 'available' && (
                        <Badge variant="emerald">
                          {item.ownershipStatus === 'owned_permanent'
                            ? 'Adquirido'
                            : item.ownershipStatus === 'active_temporary'
                              ? 'Ativo'
                              : 'Expirado'}
                        </Badge>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white">{item.name}</h4>
                    <p className="mt-1 flex-1 text-sm text-slate-400">{item.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-400">
                        🪙 {item.cost}
                      </span>

                      {item.ownershipStatus === 'available' || item.ownershipStatus === 'expired_temporary' ? (
                        <Button
                          size="sm"
                          disabled={purchaseItem.isPending}
                          onClick={() => purchaseItem.mutate(item.id)}
                        >
                          {purchaseItem.isPending ? '...' : 'Comprar'}
                        </Button>
                      ) : item.ownershipStatus === 'owned_permanent' || item.ownershipStatus === 'active_temporary' ? (
                        EQUIPPABLE_CATEGORIES.includes(item.category) ? (
                          <Button
                            size="sm"
                            variant={item.isEquipped ? 'outline' : 'default'}
                            disabled={equipItem.isPending}
                            onClick={() => item.inventoryId && equipItem.mutate(item.inventoryId)}
                          >
                            {item.isEquipped ? 'Equipado' : 'Equipar'}
                          </Button>
                        ) : (
                          <Badge variant="emerald">Adquirido</Badge>
                        )
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
