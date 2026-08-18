import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { shopService } from '@/services/shop.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'

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

export function useEquipItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inventoryId: string) => shopService.equip(inventoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shop.state })
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.list })
      toast.success('Item equipado!')
    },
    onError: (error) => {
      toast.error(normalizeError(error).message)
    },
  })
}
