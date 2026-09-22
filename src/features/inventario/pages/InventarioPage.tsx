import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useInventory } from '@/api/shop/queries'
import { useEquipItem } from '@/api/shop/mutations'
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

const EQUIPPABLE_CATEGORIES = ['TITLE', 'AVATAR_BORDER', 'THEME', 'COSMETIC']

export default function InventarioPage() {
  const { data, isLoading, isError, refetch } = useInventory()
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
              : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
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
                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
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
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Icon className="h-5 w-5" />
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((entry) => (
                <Card key={entry.id} >
                  <div className="flex h-full flex-col">
                    <div className="mb-3 flex items-start justify-between">
                      <Badge variant={entry.item.isPremiumOnly ? 'violet' : 'default'}>
                        {CATEGORY_LABELS[entry.item.category] ?? entry.item.category}
                      </Badge>
                      {entry.isEquipped && (
                        <Badge variant="emerald">Equipado</Badge>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white">{entry.item.name}</h4>
                    <p className="mt-1 flex-1 text-sm text-slate-400">{entry.item.description}</p>

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
                          onClick={() => equipItem.mutate(entry.id)}
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
          icon={<Backpack className="h-12 w-12 text-slate-600" aria-hidden="true" />}
          title="Inventário vazio"
          description="Compre itens na loja para vê-los aqui."
        />
      )}
    </div>
  )
}
