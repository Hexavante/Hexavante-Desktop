import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: string
  href: string
  keywords: string[]
}

const COMMANDS: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', href: '/', keywords: ['inicio', 'home', 'início'] },
  { id: 'cursos', label: 'Cursos', icon: '📚', href: '/cursos', keywords: ['curso', 'aulas', 'classes'] },
  { id: 'simulados', label: 'Simulados', icon: '📝', href: '/simulados', keywords: ['prova', 'exame', 'teste'] },
  { id: 'estatisticas', label: 'Estatísticas', icon: '📊', href: '/estatisticas', keywords: ['stats', 'desempenho'] },
  { id: 'ranking', label: 'Ranking', icon: '🏆', href: '/ranking', keywords: ['leaderboard', 'classificacao'] },
  { id: 'comunidade', label: 'Comunidade', icon: '💬', href: '/comunidade', keywords: ['forum', 'discussao'] },
  { id: 'loja', label: 'Loja', icon: '🛒', href: '/loja', keywords: ['store', 'comprar'] },
  { id: 'inventario', label: 'Inventário', icon: '🎒', href: '/inventario', keywords: ['itens', 'mochila'] },
  { id: 'perfil', label: 'Perfil', icon: '👤', href: '/perfil', keywords: ['profile', 'conta', 'usuario'] },
  { id: 'config', label: 'Configurações', icon: '⚙️', href: '/configuracoes', keywords: ['settings', 'preferencias'] },
  { id: 'admin', label: 'Administração', icon: '🔐', href: '/admin', keywords: ['admin', 'permissoes', 'roles'] },
]

export function CommandPalette({ open, onOpenChange }: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.keywords.some(k => k.includes(query.toLowerCase()))
      )
    : COMMANDS

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const execute = useCallback((item: CommandItem) => {
    onOpenChange(false)
    navigate(item.href)
  }, [navigate, onOpenChange])

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx(i => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx(i => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[selectedIdx]) {
        e.preventDefault()
        execute(filtered[selectedIdx])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, filtered, selectedIdx, execute])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[15%] max-w-lg translate-y-0 p-0">
        <div className="p-3">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <svg className="h-4 w-4 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Digite para navegar..."
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIdx(0) }}
            />
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500">ESC</kbd>
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto px-3 pb-3">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">Nenhum resultado</p>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((item, idx) => (
                <button
                  key={item.id}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                    idx === selectedIdx ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-white/5'
                  }`}
                  onClick={() => execute(item)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                >
                  <span className="w-5 text-center">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate">{item.label}</span>
                  </div>
                  {idx === selectedIdx && <span className="text-xs text-cyan-400">↵</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
