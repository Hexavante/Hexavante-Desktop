import { useEffect } from 'react'
import { useAuthStore } from '@/app/stores/auth.store'
import { useThemeStore } from '@/app/stores/theme.store'
import { shopService } from '@/services/shop.service'
import { getThemeIdOf } from '@/lib/cosmetics'

/**
 * Sincroniza o tema cosmético com o servidor (F3 do plano de temas).
 * O inventário é a fonte da verdade: aplica o THEME equipado e válido.
 * Roda quando o usuário autentica; silencioso em erro.
 */
export function useServerThemeSync() {
  const userId = useAuthStore((s) => s.user?.id ?? null)

  useEffect(() => {
    if (!userId) return
    let active = true
    shopService
      .getInventory()
      .then(({ items }) => {
        if (!active) return
        const now = new Date()
        const equipped = items.find((e) => {
          if (!e.isEquipped) return false
          if (e.expiresAt && new Date(e.expiresAt) <= now) return false
          return getThemeIdOf(e.item) != null
        })
        const themeId = equipped ? getThemeIdOf(equipped.item) : null
        if (themeId) {
          const current = useThemeStore.getState().cosmeticTheme
          if (current !== themeId) {
            useThemeStore.getState().setCosmeticTheme(themeId)
          }
        }
      })
      .catch(() => {
        // Offline/erro — mantém o tema local
      })
    return () => {
      active = false
    }
  }, [userId])
}
