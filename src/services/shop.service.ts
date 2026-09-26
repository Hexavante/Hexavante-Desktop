import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type { ShopState, InventoryEntry } from '@/domain/types/shop.types'

export const shopService = {
  async getShopState(): Promise<ShopState> {
    const { data } = await api.get<ShopState>(ENDPOINTS.SHOP.STATE)
    return data
  },

  async purchase(storeItemId: string): Promise<void> {
    await api.post(ENDPOINTS.SHOP.PURCHASE, { storeItemId })
  },

  async equip(inventoryId: string): Promise<void> {
    await api.post(ENDPOINTS.SHOP.EQUIP, { inventoryId })
  },

  async getInventory(): Promise<{ items: InventoryEntry[] }> {
    const { data } = await api.get<{ items: InventoryEntry[] }>(ENDPOINTS.INVENTORY.LIST)
    return data
  },

  async activateTrial(): Promise<{ premium: boolean; premiumExpiresAt: string | null }> {
    const { data } = await api.post<{ premium: boolean; premiumExpiresAt: string | null }>(
      ENDPOINTS.SHOP.TRIAL,
    )
    return data
  },
}
