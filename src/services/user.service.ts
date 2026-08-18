import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type { UserProfile, UpdateProfileRequest, PublicProfile } from '@/domain/types/user.types'

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<{ user: UserProfile }>(ENDPOINTS.USERS.ME)
    return data.user
  },

  async getPublicProfile(username: string): Promise<PublicProfile> {
    const { data } = await api.get<{ user: PublicProfile }>(ENDPOINTS.USERS.PUBLIC_PROFILE(username))
    return data.user
  },

  async updateProfile(body: UpdateProfileRequest): Promise<UserProfile> {
    const { data } = await api.patch<{ user: UserProfile }>(ENDPOINTS.USERS.ME, body)
    return data.user
  },

  async deleteAccount(): Promise<void> {
    await api.delete(ENDPOINTS.USERS.ME)
  },
}
