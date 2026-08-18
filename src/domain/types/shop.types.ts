export interface ShopItemView {
  id: string
  slug: string
  name: string
  description: string
  cost: number
  category: string
  imageUrl: string | null
  isPremiumOnly: boolean
  isPermanent: boolean
  ownershipStatus: 'available' | 'owned_permanent' | 'active_temporary' | 'expired_temporary'
  inventoryId: string | null
  isEquipped: boolean
  expiresAt: string | null
}

export interface InventoryEntry {
  id: string
  storeItemId: string
  isEquipped: boolean
  purchasedAt: string
  expiresAt: string | null
  item: {
    id: string
    slug: string
    name: string
    description: string
    cost: number
    category: string
    imageUrl: string | null
    isPremiumOnly: boolean
    isPermanent: boolean
  }
}

export interface ShopState {
  items: ShopItemView[]
  inventory: InventoryEntry[]
  coins: number
  premium: boolean
  premiumExpiresAt: string | null
  coinHistory: CoinTransaction[]
}

export interface CoinTransaction {
  id: string
  amount: number
  type: string
  source: string
  description: string | null
  createdAt: string
}
