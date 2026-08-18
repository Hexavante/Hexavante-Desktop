import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { shopService } from '@/services/shop.service'
import { staleTimes } from '@/app/queries/options'

export function useShopState() {
  return useQuery({
    queryKey: queryKeys.shop.state,
    queryFn: () => shopService.getShopState(),
    staleTime: staleTimes.FAST,
  })
}

export function useInventory() {
  return useQuery({
    queryKey: queryKeys.inventory.list,
    queryFn: () => shopService.getInventory(),
    staleTime: staleTimes.FAST,
  })
}
