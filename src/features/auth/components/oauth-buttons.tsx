import type { ReactElement } from 'react'
import { Loader2 } from 'lucide-react'
import { DiscordIcon, GitHubIcon, GoogleIcon, MicrosoftIcon } from './oauth-icons'

export type OAuthProvider = 'google' | 'microsoft' | 'github' | 'discord'

type Props = {
  /** true enquanto um fluxo OAuth está em andamento (desabilita todos os botões) */
  disabled?: boolean
  /** provedor cujo fluxo está em andamento (mostra o spinner no botão dele) */
  pendingProvider?: string | null
  onSelect: (provider: OAuthProvider) => void
}

/**
 * Lista de provedores sociais + divisor "ou continue com email".
 * Ordem fixa: Google, Microsoft, GitHub, Discord (mesma do app web).
 * Coluna única: o cartão de auth tem max-w-md e os rótulos "Continuar com X"
 * não cabem em duas colunas sem quebrar linha.
 */
const PROVIDERS: { key: OAuthProvider; label: string; Icon: () => ReactElement }[] = [
  { key: 'google', label: 'Google', Icon: GoogleIcon },
  { key: 'microsoft', label: 'Microsoft', Icon: MicrosoftIcon },
  { key: 'github', label: 'GitHub', Icon: GitHubIcon },
  { key: 'discord', label: 'Discord', Icon: DiscordIcon },
]

export function OAuthButtons({ disabled = false, pendingProvider = null, onSelect }: Props) {
  return (
    <div className="w-full space-y-3">
      {PROVIDERS.map(({ key, label, Icon }) => {
        const loading = disabled && pendingProvider === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            disabled={disabled}
            aria-label={`Continuar com ${label}`}
            className="hx-btn-secondary inline-flex min-h-11 w-full items-center justify-center gap-3 px-5 py-2.5 transition-all hover:shadow-md"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
            ) : (
              <Icon />
            )}
            Continuar com {label}
          </button>
        )
      })}

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium text-slate-500">ou continue com email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  )
}
