import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useTheme } from '@/app/hooks/use-theme'
import { useInventory } from '@/api/shop/queries'
import { APP_THEMES } from '@/lib/cosmetics'
import { cn } from '@/lib/utils'

const THEME_LIST = Object.values(APP_THEMES).filter(t => t.id !== 'default')

// Slugs/nomes legados que não correspondem 1:1 ao id do tema cosmético.
const LEGACY_THEME_ALIASES: Record<string, string> = {
  matrix: 'hacker',
}

interface ThemeSource {
  slug: string
  name: string
  metadata?: unknown
}

// Resolve o id do tema cosmético a partir de um item da loja/inventário.
// Suporta metadata.themeId (contrato atual da API) e, como fallback,
// convenções de slug ("tema-<id>") e nome — incluindo aliases legados
// como "tema-matrix" → tema "hacker".
function resolveThemeId(source: ThemeSource): string | null {
  const metadata = source.metadata as { themeId?: unknown } | null | undefined
  if (metadata && typeof metadata.themeId === 'string') {
    const raw = metadata.themeId.toLowerCase()
    const aliased = LEGACY_THEME_ALIASES[raw] ?? raw
    if (APP_THEMES[aliased]) return aliased
  }

  const slug = source.slug.toLowerCase()
  const name = source.name.toLowerCase()

  for (const id of Object.keys(APP_THEMES)) {
    if (id === 'default') continue
    if (slug === id || slug === `tema-${id}` || slug === `theme-${id}`) return id
  }

  for (const [alias, id] of Object.entries(LEGACY_THEME_ALIASES)) {
    if (!APP_THEMES[id]) continue
    if (slug === alias || slug === `tema-${alias}` || slug === `theme-${alias}` || name.includes(alias)) {
      return id
    }
  }

  for (const id of Object.keys(APP_THEMES)) {
    if (id === 'default') continue
    if (slug.includes(id) || name.includes(APP_THEMES[id].label.toLowerCase())) return id
  }

  return null
}

export function ThemeSelector() {
  const { cosmeticTheme, setCosmeticTheme } = useTheme()
  const navigate = useNavigate()
  // Leitura silenciosa: em erro de rede, `data` fica indefinido e caímos
  // no fallback (todos clicáveis), sem nenhum indicador de erro.
  const { data: inventory } = useInventory()

  const ownedThemeIds = useMemo(() => {
    // Desconhecido (carregando ou erro) → null = comportamento atual.
    if (!inventory) return null
    const owned = new Set<string>(['default'])
    const now = Date.now()
    for (const entry of inventory.items ?? []) {
      if (entry.expiresAt && new Date(entry.expiresAt).getTime() <= now) continue
      const themeId = resolveThemeId({
        slug: entry.item.slug,
        name: entry.item.name,
        metadata: entry.item.metadata,
      })
      if (themeId) owned.add(themeId)
    }
    return owned
  }, [inventory])

  const isLocked = (themeId: string): boolean => ownedThemeIds !== null && !ownedThemeIds.has(themeId)

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <button
        onClick={() => setCosmeticTheme('default')}
        className={cn(
          'relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
          cosmeticTheme === 'default'
            ? 'border-cyan-400/50 bg-cyan-500/10 ring-1 ring-cyan-400/30'
            : 'border-sidebar-border bg-sidebar-accent/50 hover:border-cyan-400/30 hover:bg-cyan-500/5'
        )}
      >
        <div className="flex h-12 w-full items-center justify-center gap-1 rounded-lg bg-[#06080f]">
          <span className="h-3 w-3 rounded-full bg-[#2563eb]" />
          <span className="h-3 w-3 rounded-full bg-[#22d3ee]" />
        </div>
        <span className="text-xs font-semibold text-sidebar-foreground">Padrão</span>
      </button>

      {THEME_LIST.map(theme => {
        const [c1, c2] = theme.preview
        const isActive = cosmeticTheme === theme.id
        const locked = isLocked(theme.id)

        return (
          <button
            key={theme.id}
            onClick={() => {
              if (locked) navigate('/loja')
              else setCosmeticTheme(theme.id)
            }}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
              isActive
                ? 'border-cyan-400/50 bg-cyan-500/10 ring-1 ring-cyan-400/30'
                : locked
                  ? 'cursor-pointer border-border opacity-60 grayscale hover:border-cyan-400/30 hover:opacity-90'
                  : 'border-sidebar-border bg-sidebar-accent/50 hover:border-cyan-400/30 hover:bg-cyan-500/5'
            )}
            title={locked ? 'Disponível na loja — clique para ver' : theme.description}
            aria-label={locked ? `${theme.label} (disponível na loja)` : theme.label}
          >
            <div
              className="relative flex h-12 w-full items-center justify-center gap-1 rounded-lg"
              style={{ backgroundColor: theme.vars['--background'] || '#06080f' }}
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c1 }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c2 }} />
              {locked && !isActive ? (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-foreground drop-shadow" aria-hidden="true" />
                </span>
              ) : null}
            </div>
            <span className="text-xs font-semibold text-sidebar-foreground">{theme.label}</span>
            {locked && !isActive ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <Lock className="h-3 w-3" aria-hidden="true" /> Na loja
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
