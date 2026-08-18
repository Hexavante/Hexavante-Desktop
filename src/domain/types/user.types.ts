export interface UserProfile {
  id: string
  username: string
  fullName: string
  email: string
  avatarUrl: string | null
  birthDate: string
  phone: string | null
  city: string | null
  state: string | null
  bio: string | null
  profileVisibility: 'private' | 'public'
  isVerified: boolean
  isPremium: boolean
  coins: number
  createdAt: string
  updatedAt: string
}

export interface PublicProfile {
  id: string
  username: string | null
  fullName: string
  avatarUrl: string | null
  bio: string | null
  profileVisibility: string
  isVerified: boolean
  isPremium: boolean
  createdAt: string
}

export interface UpdateProfileRequest {
  fullName?: string
  username?: string
  birthDate?: string
}
