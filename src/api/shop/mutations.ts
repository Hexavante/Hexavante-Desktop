import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { shopService } from '@/services/shop.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'
import { useThemeStore } from '@/app/stores/theme.store'

export function usePurchaseItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (storeItemId: string) => shopService.purchase(storeItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shop.state })
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.list })
      toast.success('Item comprado!')
    },
    onError: (error) => {
      toast.error(normalizeError(error).message)
    },
  })
}

export function useActivateTrial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => shopService.activateTrial(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shop.state })
      toast.success('Trial Premium ativado! Aproveite os 30 dias.')
    },
    onError: (error) => {
      toast.error(normalizeError(error).message)
    },
  })
}

export function useEquipItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { inventoryId: string; applyThemeId?: string | null }) =>
      shopService.equip(input.inventoryId),
    onSuccess: (_data, input) => {
      // Equipar tema aplica na hora no app (tema é local); desequipar volta ao padrão.
      if (input.applyThemeId !== undefined) {
        useThemeStore.getState().setCosmeticTheme(input.applyThemeId ?? 'default')
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.shop.state })
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.list })
      toast.success('Item equipado!')
    },
    onError: (error) => {
      toast.error(normalizeError(error).message)
    },
  })
}
