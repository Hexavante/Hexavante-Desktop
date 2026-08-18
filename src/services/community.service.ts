import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type { FeedActivity, ActivityComment, TrendingTag, SuggestedUser } from '@/domain/types/community.types'

export interface CreateDiscussionInput {
  title: string
  body: string
  tags?: string[]
}

export const communityService = {
  async getFeed(type: string): Promise<FeedActivity[]> {
    const { data } = await api.get<FeedActivity[]>(ENDPOINTS.COMMUNITY.FEED(type))
    return data
  },

  async createDiscussion(input: CreateDiscussionInput): Promise<FeedActivity> {
    const { data } = await api.post<FeedActivity>(ENDPOINTS.COMMUNITY.CREATE_DISCUSSION, input)
    return data
  },

  async toggleLike(activityId: string): Promise<{ liked: boolean }> {
    const { data } = await api.post<{ liked: boolean }>(ENDPOINTS.COMMUNITY.LIKE(activityId))
    return data
  },

  async toggleReaction(activityId: string, type: string): Promise<{ active: boolean }> {
    const { data } = await api.post<{ active: boolean }>(ENDPOINTS.COMMUNITY.REACT(activityId), { type })
    return data
  },

  async getComments(activityId: string): Promise<ActivityComment[]> {
    const { data } = await api.get<ActivityComment[]>(ENDPOINTS.COMMUNITY.COMMENTS(activityId))
    return data
  },

  async addComment(activityId: string, content: string): Promise<ActivityComment> {
    const { data } = await api.post<ActivityComment>(ENDPOINTS.COMMUNITY.ADD_COMMENT(activityId), { content })
    return data
  },

  async getTrendingTags(): Promise<TrendingTag[]> {
    const { data } = await api.get<TrendingTag[]>(ENDPOINTS.COMMUNITY.TRENDING_TAGS)
    return data
  },

  async getSuggestedUsers(): Promise<SuggestedUser[]> {
    const { data } = await api.get<SuggestedUser[]>(ENDPOINTS.COMMUNITY.SUGGESTED_USERS)
    return data
  },

  async toggleFollow(userId: string): Promise<{ following: boolean }> {
    const { data } = await api.post<{ following: boolean }>(ENDPOINTS.COMMUNITY.FOLLOW(userId))
    return data
  },

  async report(activityId: string, reason: string, details?: string): Promise<void> {
    await api.post(ENDPOINTS.COMMUNITY.REPORT(activityId), { reason, details })
  },

  async deletePost(activityId: string): Promise<void> {
    await api.delete(ENDPOINTS.COMMUNITY.DELETE(activityId))
  },

  async togglePin(activityId: string): Promise<void> {
    await api.post(ENDPOINTS.COMMUNITY.PIN(activityId))
  },
}
