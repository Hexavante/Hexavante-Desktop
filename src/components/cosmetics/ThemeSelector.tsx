import { useTheme } from '@/app/hooks/use-theme'
import { APP_THEMES } from '@/lib/cosmetics'
import { cn } from '@/lib/utils'

const THEME_LIST = Object.values(APP_THEMES).filter(t => t.id !== 'default')

export function ThemeSelector() {
  const { cosmeticTheme, setCosmeticTheme } = useTheme()

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

        return (
          <button
            key={theme.id}
            onClick={() => setCosmeticTheme(theme.id)}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
              isActive
                ? 'border-cyan-400/50 bg-cyan-500/10 ring-1 ring-cyan-400/30'
                : 'border-sidebar-border bg-sidebar-accent/50 hover:border-cyan-400/30 hover:bg-cyan-500/5'
            )}
            title={theme.description}
          >
            <div
              className="flex h-12 w-full items-center justify-center gap-1 rounded-lg"
              style={{ backgroundColor: theme.vars['--background'] || '#06080f' }}
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c1 }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c2 }} />
            </div>
            <span className="text-xs font-semibold text-sidebar-foreground">{theme.label}</span>
          </button>
        )
      })}
    </div>
  )
}
